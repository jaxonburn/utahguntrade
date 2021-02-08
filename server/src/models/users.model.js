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
    email: { type: String, unique: true, lowercase: true },
    phone: {type: String, required: false},
    password: { type: String },
    avatar: {type: String, default: 'https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png'},
    premium: {type: Boolean, default: false},
    listings: [{type: Schema.Types.ObjectId, ref: 'listings'}],
    watch: [{type: Schema.Types.ObjectId, ref: 'listings'}],
    chats: [{type: Schema.Types.ObjectId, ref: 'chats'}],

    googleId: { type: String },
    facebookId: { type: String },

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
