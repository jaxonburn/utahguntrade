// appErrors-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const appErrors = new Schema({
    type: {type: String, required: false},
    code: { type: String, required: false },
    className: { type: String, required: false }
  }, {
    timestamps: true
  });

  return mongooseClient.model('appErrors', appErrors);
};
