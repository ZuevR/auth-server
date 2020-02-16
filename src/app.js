const express = require('express');
const klawSync = require('klaw-sync');
const path = require('path');
const { handleError } = require('./helpers/error');

class AppController {
  constructor() {
    this.app = express();

    this.middleware();
    this.routes();
    this.errorHandler();
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  errorHandler() {
    this.app.use((err, req, res, next) => handleError(err, res));
  }

  routes() {
    const paths = klawSync(path.resolve(__dirname, 'controllers'), { nodir: true });
    let controllersCount = 0;
    paths.forEach((file) => {
      if (path.basename(file.path)[0] === '_' || path.basename(file.path)[0] === '.') return;
      this.app.use('/api/v1', require(file.path));
      controllersCount++;
    });

    console.info(`Total controllers: ${controllersCount}`);
  }
}

const app = new AppController().app;

module.exports = app;
