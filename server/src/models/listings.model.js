// listings-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'listings';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    listedBy: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    price: {type: Number, required: true},
    city: {type: String, required: false},
    images: {type: Array, required: false},
    title: {type: String, required: true},
    description: {type: String},
    watchedBy: [{type: Schema.Types.ObjectId, ref: 'users'}],
    category: {type: String, enum: ['']},
    condition: {type: String, enum: ['New', 'Like New','Used']},
    tags: {type: String},
    sold: {type: Boolean},
    viewed: [{type: Schema.Types.ObjectId, ref: 'users'}]
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
