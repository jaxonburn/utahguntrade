// analytics-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const analytics = new Schema({
    reqFrom: {type: String, required: true},
    date: {type: Date, default: new Date()}
  }, {
  });

  return mongooseClient.model('analytics', analytics);
};
