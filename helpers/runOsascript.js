let runCommand = require('./runCommand');

module.exports = (script, newWindow) => {
  return new Promise((resolve, reject) => {
    if (newWindow) {
      runCommand(`osascript -e 'tell application "Terminal" \n do script "cd ${script}" \n end tell'`).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    } else {
      runCommand(`osascript -e 'tell application "Terminal" \n do script "cd ${script}" in window 1 \n end tell'`).then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    };
  });
};
