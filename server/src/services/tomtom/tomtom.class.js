const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.tomtom.com',
  withCredentials: false, // This is the default
});

const key = 'GMC0kbMxjXm2blWcDoTtsg8WGhicEIaJ';

exports.Tomtom = class Tomtom {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    let queryParams = {
      key: key,
      language: 'en-US',
      limit: 5,
      countrySet: 'US',
      typeahead: true,
    };
    return await apiClient.get('/search/2/geocode/' + encodeURI(params.query.text) + '.json',{'params': queryParams})
      .then(res => {
        return res.data;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('geocode error', err.errno);
        return err;
      });
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
  }

};
