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
    document: { required: false, default: null, type: Schema.Types.ObjectId, ref: 'documents' },
    point: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number],
      }
    },
    title: {type: String, required: true},
    description: {type: String},
    watchedBy: [{type: Schema.Types.ObjectId, ref: 'users'}],
    category: {type: String, enum: ['Knives', 'Rifle', 'AssaultRifle', 'Handgun', 'SubmachineGun', 'Hunting', 'Magazines', 'Scopes', 'Other', 'AssaultAmmo', 'HandgunAmmo.', 'RifleAmmo', 'ShotgunAmmo', 'SubmachineAmmo', 'Misc' ]},
    condition: {type: String, enum: ['New', 'Like New','Used', 'Worn']},
    tags: [{type: String}],
    sold: {type: Boolean, default: false},
    viewed: [{type: Schema.Types.ObjectId, ref: 'users'}],
    archived: {type: Boolean, default: false},
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
