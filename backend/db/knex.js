const options = require('./options');
const knex = require('knex')(options);

module.exports = knex;
