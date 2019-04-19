let runCommand = require('./runCommand');

module.exports = (script, newWindow) => {
  return runCommand(`osascript -e 'tell application "Terminal" to do script "${script}" ${newWindow ? '' : 'in window 1'}'`);
};
