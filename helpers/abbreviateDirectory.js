let homedir = require('os').homedir();

module.exports = (dir) => {
  if (dir.includes(homedir.toLowerCase())) dir = dir.replace(homedir.toLowerCase(), '~');
  return dir;
};
