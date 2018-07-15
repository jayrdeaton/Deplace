let { join } = require('path'),
  { lstatSync, readdirSync } = require('fs');

module.exports = (dir) => {
  let isDirectory = dir => lstatSync(dir).isDirectory();
  let isVisible = name => !(/(^|\/)\.[^\/\.]/g).test(name)
  return readdirSync(dir).map(name => join(dir, name)).filter(isVisible).filter(isDirectory);
};
