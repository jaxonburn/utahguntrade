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
    published: {type: Boolean, default: false},
    views: {type: Number},
    publishedAt: {type: Date}
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
