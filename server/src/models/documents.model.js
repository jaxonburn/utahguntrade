// documents-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const encrypt = require('mongoose-encryption');
module.exports = function (app) {
  const modelName = 'documents';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    document: { type: Object, required: false },
    signature: { type: String, required: true },
    dateSigned: { type: String, required: true },
    notes: { type: String, required: false },
    listing: { type: Schema.Types.ObjectId, required: true, ref: 'listings' }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }

  const encKey = app.get('encryption').ENCRYPT_32BYTE_STRING;
  const sigKey = app.get('encryption').ENCRYPT_64BYTE_STRING;

  schema.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey });

  return mongooseClient.model(modelName, schema);

};
