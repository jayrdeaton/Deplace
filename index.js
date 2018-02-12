#!/usr/bin/env node
let deplace = require('./commands').deplace;

if (process.argv.length === 2) process.argv.push('help');

deplace.parse(process.argv);
