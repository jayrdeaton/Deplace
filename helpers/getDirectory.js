let runCommand = require('./runCommand');

module.exports = (dir) => {
  return new Promise((resolve, reject) => {
    runCommand(`cd ${dir} && pwd`).then((data) => {
      data = data.replace(/\n/g, '');
      resolve(data.toLowerCase());
    }).catch((err) => {
      resolve();
    });
  });
};
