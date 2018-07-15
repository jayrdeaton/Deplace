let Emporium = require('emporium'),
  { jsonAdapter } = require('../adapters');

let emporium = new Emporium();

emporium.setAdapter(jsonAdapter);
emporium.setIdentifier('uuid');

module.exports = emporium;
