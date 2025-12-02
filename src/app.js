const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const rootDir = path.resolve(__dirname, '..');
app.use(express.static(path.join(rootDir, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'login.html'));
});

app.use(routes);
app.use(errorHandler);

module.exports = app;