const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const knex = require('./db/knex');

const helmet = require('helmet');
const logger = require('./logger');

const indexRouter = require('./routes/index');
const profileRouter = require('./routes/profile');
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
app.use('/profile', profileRouter);

app.use('*', (req, res) => {
    console.log('ALERT', req.originalUrl);
    res.status(404).send('Not Found');
});

app.use(function(req, res, next) {
    next(createError(404));
});

module.exports = app;
