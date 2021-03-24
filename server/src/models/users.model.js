// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new mongooseClient.Schema({
    username: { type: String, required: true, unique: true},
    notifications: { type: Array, required: false, default: [] },
    email: { type: String, unique: true, lowercase: true, required: true },
    phone: {type: String, required: false, unique: true},
    password: { type: String },
    avatar: {type: String, default: 'https://guntrade.s3-us-west-1.amazonaws.com/STATICSAVE/defaultProfile.png'},
    premium: {type: Boolean, default: false},
    listings: [{type: Schema.Types.ObjectId, ref: 'listings'}],
    watched: [{type: Schema.Types.ObjectId, ref: 'listings'}],
    chats: [{type: Schema.Types.ObjectId, ref: 'chats'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'articles'}],

    googleId: { type: String },


    facebookId: { type: String },
    stripeId: {type: String},
    takeToListings: { type: Boolean, default: false },
    active: false,

    // For Auth Management
    isVerified: {type: Boolean},
    verifyToken: {type: String},
    verifyExpires: {type: Date},
    verifyChanges: {type: Object},
    resetToken: {type: String},
    resetExpires: {type: Date}


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
