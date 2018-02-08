let changeDirectory = require('./helpers').changeDirectory;

let test = async () => {
  await changeDirectory('~/Developer/Node', true);
  await changeDirectory('~/Developer/Xcode', true);
};

test().then(() => {
  console.log('Successfull')
}).catch((err) => {
  console.log(err)
});
