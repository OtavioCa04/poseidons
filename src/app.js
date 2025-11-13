const express = require('express');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rootDir = path.resolve(__dirname, '..');
app.use(express.static(path.join(rootDir, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'index.html'));
});

app.use(routes);
app.use(errorHandler);

module.exports = app;
