const { authenticate } = require('@feathersjs/authentication').hooks;
const AWS = require('aws-sdk');

const attachToListing = context => {
  console.log(context.result);
  if(context.result.listing) {
    let patchObj = {
      document: context.result
    };
    context.app.service('listings').patch(context.result.listing, patchObj);
  }
};

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

let s3 = new AWS.S3();

async function getImage(key){
  const data =  s3.getObject(
    {
      Bucket: 'guntrade',
      Key: key
    }

  ).promise();
  return data;
}

function encode(data){
  let buf = Buffer.from(data);
  let base64 = buf.toString('base64');
  return base64;
}

const getAWSImage = async context => {
  if(context.result.document && context.result.document.key.includes(context.params.user._id)) {
    await getImage(context.result.document.key).then((img)=>{
      let image = 'data:image/jpeg;base64,' + encode(img.Body);
      context.result.document = String(image);
      console.log(context.result);
    }).catch((e)=>{
      console.log(e);
    });
    return context;
  } else {
    context.app.service('reported-bugs').create({
      bug: 'USER TRIED ACCESSING DOCUMENT THAT WASNT THEIRS',
      notes: 'DO SOMETHING AND CHECK USER WHO TRIED TO ACCESS DOCUMENT (PROBABLY THROUGH POSTMAN)',
      email: 'DEV ACCOUNT'
    });
    return context;
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [getAWSImage],
    create: [attachToListing],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
