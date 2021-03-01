// articles-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'articles';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    mainImage: {key: String, url: String,},
    mainTitle: {type: String, required: true},
    sections: [
      {
        title: String,
        body: String,
        image: {key: String, url: String},
      }
    ],
    readTime: {type: String, required: false},
    createdBy: {type: String, required: true},
    avatar: {key: String, url: String,},
    about: {type: String, required: false},
    published: {type: Boolean, default: false},
    views: {type: Number},
    paid: {type: Boolean, default: false},
    publishedAt: {type: Date, default: new Date()},
    favorites: [{type: Schema.Types.ObjectId, ref: 'users'}],
    comments: [new Schema({
      sentBy: {type: Schema.Types.ObjectId, ref: 'users', required: true},
      message: {type: String, required: true},
      upVote: [{type: Schema.Types.ObjectId, ref: 'users'}],
      replies: [{sentBy: {type: Schema.Types.ObjectId, ref: 'users'}, message: {type: String, required: true}}],
      createdAt: {type: Date, default: new Date()}
    }, {
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
