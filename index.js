#!/usr/bin/env node
let { program, helpers } = require('./src'),
  { printError } = helpers;

let run = async(args) => {
  if (args.length === 2) args.push('help');
  try {
    await program.parse(args);
  } catch(err) {
    printError(err);
  };
};

run(process.argv);
