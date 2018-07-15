let { Schema } = require('emporium'),
  uuid = require('uuid').v1,
  store = require('../store');

let schema = new Schema({
  createdAt: { type: Date, default: new Date },
  dir: String,
  name: String,
  uuid: { type: String, default: uuid() }
});

schema.setIdentifier('uuid');

module.exports = store.storable('Shortcut', schema);
