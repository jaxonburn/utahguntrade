const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');


const bar = new cliProgress.SingleBar({
  stopOnComplete: true,
  format: ' >> [\u001b[32m{bar}\u001b[0m] {percentage}% | ETA: {eta}s | {value}/{total} | {message}',
}, cliProgress.Presets.shades_classic);

const server = axios.create({
  baseURL: 'http://localhost:3030',
  headers: {
    contentType: 'application/json',
    Accept: 'application/json',
  }
});


seedData(50);

async function seedData(amount) {
  let created = false;

  bar.start(100, 0);


  bar.update(10, {message: 'Axios Instance Created'});


  await server.post('/users', {
    username: 'GunHubUtahSupport',
    email: 'gunhubutah@gmail.com',
    password: 'support',
  }).then(() => {
    created = true;
  }).catch((err) => {
    if (err.response.data.code !== 409) {
      throw Error('\nFailed at Support User Creation - ' + JSON.stringify(err.response.data));
    }
  });

  bar.update(20, {message: created ? 'Support User Created' : 'Support Already Exists Moving On'});

  await server.post('/authentication', {
    email: 'gunhubutah@gmail.com',
    password: 'support',
    strategy: 'local'
  }).then((res) => {
    server.defaults.headers['Authorization'] = 'Bearer ' + res.data.accessToken;
  }).catch((err) => {
    throw Error('\nFailed Authenticating User - ' + JSON.stringify(err.response.data));
  });

  bar.update(30, {message: 'Authenticated User'});

  bar.update(40, {message: 'Checking if Locations Generated'});

  const locations = ['Lehi, UT', 'Pleasant Grove, UT', 'Draper, UT', 'Provo, UT', 'Ogden, UT'];
  let savedLocations = [];


  try {
    savedLocations = await fs.promises.readFile(path.resolve(__dirname, 'locations.json'), 'utf8');
    savedLocations = JSON.parse(savedLocations);
    bar.update(50, {message: 'Saved File Already Exists - Importing'});
  } catch (err) {
    bar.update(50, {message: 'No Saved File - Generating...'});
    await Promise.all(locations.map((location) => {
      return server.get('/tomtom', {
        params: {
          text: location
        }
      });
    })).then((res) => {
      res.forEach((locationRes) => {
        let address = locationRes.data.results[0];
        let coordinates = {type: 'Point', coordinates: [address.position.lon, address.position.lat]};
        savedLocations.push({address, coordinates});
      });

      try {
        fs.writeFileSync(path.resolve(__dirname, 'locations.json'), JSON.stringify(savedLocations));
      } catch (err) {
        throw Error('Location.json write file failed');
      }

    }).catch((err) => {
      throw Error('\nLocation Generate Failed' + err);
    });
  }


  const conditions = ['New', 'Like New', 'Used', 'Worn'];
  const gunTypes = ['Handgun', 'Shotgun', 'Rifle'];
  const gunTitles = [
    '9MM Pistol',
    'Shotgun - CZ 1012',
    'Assault Rifle'
  ];
  const gunDescriptions = [
    '9MM Pistol Handgun for sale. Willing to meet within 20 miles of my location. Great handgun for taking to the range.No offers please, I\'m firm on the price.',
    'Accepting offers or trades. Fantastic Shotgun for shooting clay pidgeons. I prefer communication through the app messaging.',
    'Selling rifle for price or best offer. Comes with tactical scope. Originally bought from joe smoes gun store. Feel free to message me potential trades.',
  ];
  const gunImages = [
    [
      {
        key: 'profile/202106/guntrade_PistolAuto9mm1AKolkata201201238779.jfif1626984159415',
        url: 'https://guntrade.s3.us-west-1.amazonaws.com/profile/202106/guntrade_PistolAuto9mm1AKolkata201201238779.jfif1626984159415',
      }
    ],
    [
      {
        key: 'profile/202106/guntrade_Shotgun.png1626983934461',
        url: 'https://guntrade.s3.us-west-1.amazonaws.com/profile/202106/guntrade_Shotgun.png1626983934461',
      }
    ],
    [
      {
        key: 'profile/202106/guntrade_istockphoto157406050612x612.jpg1626983296873',
        url: 'https://guntrade.s3.us-west-1.amazonaws.com/profile/202106/guntrade_istockphoto157406050612x612.jpg1626983296873',
      }
    ],
  ];

  let gunData = [];

  for (let i = 0; i < amount; i++) {
    let randomizedGun = Math.floor(Math.random() * 3);
    let randomizedLocation = Math.floor(Math.random() * 5);

    let data = {
      title: gunTitles[randomizedGun],
      description: gunDescriptions[randomizedGun],
      category: gunTypes[randomizedGun],
      price: Math.floor(Math.random() * 1000) + 100,
      images: gunImages[randomizedGun],
      condition: conditions[Math.floor(Math.random() * 4)],
      point: savedLocations[randomizedLocation].coordinates,
      address: savedLocations[randomizedLocation].address,
      listedBy: '60f9ee39b444154998b27842'
    };
    gunData.push(data);
  }
  bar.update(60, {message: 'Generated Gun Data'});

  await Promise.all(gunData.map((gun) => {
    return server.post('/listings', gun);
  })).catch((err) => {
    console.log('heres the error', err);
  });

  bar.update(100, {message: `${amount} Randomized Listings Posted.`});
}

