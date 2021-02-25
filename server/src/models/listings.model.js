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
    images: [{
      key: String,
      url: String
    }],
    address: {},
    title: {type: String, required: true},
    description: {type: String},
    watchedBy: [{type: Schema.Types.ObjectId, ref: 'users'}],
    category: {type: String, enum: ['Rifle', 'Handgun', 'Hunting', 'Magazines', 'Scopes','Other', '9mm', '223/5.56', '45 ACP', '12-Gauge', '.22', '.308' ]},
    condition: {type: String, enum: ['New', 'Like New','Used', 'Worn']},
    tags: [{type: String}],
    sold: {type: Boolean},
    viewed: [{type: Schema.Types.ObjectId, ref: 'users'}],
    archived: {type: Boolean, default: false}
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
