import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { iff, discard, paramsForServer } from 'feathers-hooks-common'
import feathersVuex from 'feathers-vuex'

const socket = io('http://localhost:3030', {transports: ['websocket']})

const feathersClient = feathers()
  .configure(socketio(socket, {timeout: 15000}))
  .configure(auth({ storage: window.localStorage }))
  .hooks({
    before: {
      all: [
        iff(
          context => ['create', 'update', 'patch'].includes(context.method),
          discard('__id', '__isTemp')
        ),
        context => {
          context.params = paramsForServer({...context.params, boring: 'b003AXeUk4bdTNweUgFT2fLhqjr1tuQ52sVqFnoC'});
        }
      ]
    }
  })

export default feathersClient

// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } = feathersVuex(
  feathersClient,
  {
    serverAlias: 'api', // optional for working with multiple APIs (this is the default value)
    idField: '_id', // Must match the id field in your database table/collection
    whitelist: ['$regex', '$options']
  }
)

export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex }
