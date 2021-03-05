// posts-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'posts';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    madeBy: {type: Schema.Types.ObjectId, required: true},
    comments: [new Schema({
      sentBy: {type: Schema.Types.ObjectId, ref: 'users', required: true},
      message: {type: String, required: true},
      upVote: [{type: Schema.Types.ObjectId, ref: 'users'}],
      replies: [{sentBy: {type: Schema.Types.ObjectId, ref: 'users'}, message: {type: String, required: true}}],
      createdAt: {type: Date, default: new Date()}
    }, {
    })],
    upVotes: [{type: Schema.Types.ObjectId}],
    downVotes: [{types: Schema.Types.ObjectId}],
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
