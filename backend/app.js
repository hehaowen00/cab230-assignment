const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');

const knex = require('./db/knex');
const logger = require('./logger');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var app = express({ strict: true });
app.use(logger);
app.use(helmet());

// add database to request handler
app.use((req, _res, next) => {
    req.db = knex;
    next()
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', indexRouter);
app.use('/user', usersRouter);

// handle all routes not matched
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
});

app.use(function(req, res, next) {
    next(createError(404));
});

module.exports = app;
