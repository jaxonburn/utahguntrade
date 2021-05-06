import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Listings extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Listings'
  // Define default properties here
  static instanceDefaults() {
    return {
      listedBy: undefined,
      price: 0,
      images: [],
      address: '',
      title: '',
      description: '',
      watchedBy: [],
      category: '',
      condition: '',
      tags: [],
      sold: false,
      viewed: [],
      archived: false,
      contactMethods: ['Email', 'Phone', 'In app chat'],
      openToTrades: false
    }
  }
}
const servicePath = 'listings'
const servicePlugin = makeServicePlugin({
  Model: Listings,
  service: feathersClient.service(servicePath),
  servicePath
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
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
    get: [],
    create: [],
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
})

export default servicePlugin
