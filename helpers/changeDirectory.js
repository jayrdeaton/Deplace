let runOsascript = require('./runOsascript');

module.exports = (dir, newWindow) => {
  return new Promise((resolve, reject) => {
    let components = dir.split('/');
    dir = ''
    for (let [index, component] of components.entries()) {
      if (component.includes(' ')) dir += '\\"';
      dir += component;
      if (component.includes(' ')) dir += '\\"';
      if (index !== components.length - 1) dir += '/';
    };
    runOsascript(dir, newWindow).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
};
