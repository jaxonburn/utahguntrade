// chats-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'chats';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    users: [
      {
        user: {type: Schema.Types.ObjectId, ref: 'users'},
        unreadMessages: [{type: Schema.Types.ObjectId, ref: 'messages'}]
      }
    ],
    unreadMessages: [{type: Schema.Types.ObjectId}],
    messages: [new Schema({
      sentBy: {type: Schema.Types.ObjectId, ref: 'users', required: true},
      message: {type: String, required: true},
    }, {
      timestamps: true
    })],

  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
