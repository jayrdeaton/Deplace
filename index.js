#!/usr/bin/env node
let { commands } = require('./src'),
  { deplace } = commands;

if (process.argv.length === 2) process.argv.push('help');

deplace.parse(process.argv);
