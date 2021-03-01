import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client'

class Notifications extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Notifications'
  // Define default properties here
  static instanceDefaults() {
    return {
      mainImage: {},
      mainTitle: '',
      sections: [
        {
          title: '',
          body: '',
          image: {},
        }
      ],
      comments: [],
      favorites: [],
      createdBy: null,
      createdAt: new Date(),
      published: false,
      publishedAt: null,
      readTime: null
    }
  }
}
const servicePath = 'notifications'
const servicePlugin = makeServicePlugin({
  Model: Notifications,
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
