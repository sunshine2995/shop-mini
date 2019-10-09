const fs = require('fs');
const path = require('path');

const sourceFiles = {
  dev: '/config/env/dev.js',
  prod: '/config/env/prod.js',
};

const targetFile = '/config/config.js';

const env = process.argv[2];

const isProd = env === 'prod';

const sourceFile = isProd ? sourceFiles.prod : sourceFiles.dev;

const src = path.join(__dirname, sourceFile);
const target = path.join(__dirname, targetFile);
console.log(`${src} => ${target}`);

fs.copyFile(src, target, (err) => {
  if (err) {
    console.log('err: ', err);
    process.exit(1);
  }
});
