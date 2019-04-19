let runOsascript = require('./runOsascript');

module.exports = async (dir, newWindow) => {
  const components = dir.split('/');
  dir = '';
  for (let [index, component] of components.entries()) {
    if (component.includes(' ')) dir += '\\"';
    dir += component;
    if (component.includes(' ')) dir += '\\"';
    if (index !== components.length - 1) dir += '/';
  };
  await runOsascript(`cd ${dir}`, newWindow)
};
