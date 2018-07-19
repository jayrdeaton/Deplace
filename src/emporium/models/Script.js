let { Schema } = require('emporium'),
  uuid = require('uuid'),
  store = require('../store');

let schema = new Schema({
  group: String,
  shortcut: String,
  string: { type: String, default: '' },
  uuid: { type: String, default: uuid.v1 }
});

schema.setIdentifier('uuid');

module.exports = store.storable('Script', schema);
