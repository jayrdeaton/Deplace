let homedir = require('os').homedir();

module.exports = (dir) => {
  if (dir.includes(homedir)) dir = dir.replace(homedir, '~');
  return dir;
};
