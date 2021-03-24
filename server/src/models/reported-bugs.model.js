// reportedBugs-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const reportedBugs = new Schema({
    bug: { type: String, required: true },
    notes: { type: String, required: true },
    email: { type: String, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('reportedBugs', reportedBugs);
};
