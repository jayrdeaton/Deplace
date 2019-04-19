let { JSONAdapter } = require('json-emporium');

let adapter = new JSONAdapter({
  name: 'Deplace',
  pretty: true
});

module.exports = adapter;
