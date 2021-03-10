// notifications-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'notifications';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    modelId: { type: Schema.Types.ObjectId, required: false },
    text: { type: String, required: false },
    type: { required: true, type: String, enum: ['Chat', 'Other'] },
    messageObj: { type: Object, required: false },
    expired: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    displayed: { type: Boolean, default: false }
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
