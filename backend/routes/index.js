const express = require('express');
const router = express.Router({ strict: true });

const { state, contains, success, func, ident } = require('./util/combinators');
const { factorsTests, rankingsTests } = require('./tests');

/* Swagger */
const swaggerUI = require('swagger-ui-express');
const specification = require('../swagger.json');

/* GET countries */
router.get('/countries', async (req, res, _next) => {
    let { db, query } = req;

    if (Object.keys(query).length > 0) {
        res.status(400).json({
            error: true,
            message: 'Invalid query parameters. Query parameters are not permitted.'
        });
        return;
    }

    try {
        let rows = await db.distinct().select('country')
            .from('rankings')
            .orderBy('country');

        const results = rows.map(entry => entry.country);
        res.json(results);
    } catch (err) {
        res.json({
            error: true,
            message: 'Unable to fetch countries',
        });

        throw err;
    }
});

/* GET factors */
router.get('/factors/:year', async (req, res, next) => {
    let { db, query } = req;
    let { authorization } = req.headers;
    console.log(authorization);

    if (!authorization) {
        res.status(401).json({
            error: true,
            message: 'Authorization header (\'Bearer token\') not found'
        });
        return;
    }

    // validate request parameters and query parameters
    for (let i = 0; i < factorsTests.length; i++) {
        let { test, message } = factorsTests[i];
        if (!test(req)) {
            res.status(400).json({
                error: true,
                message
            });
            return;
        }
    }

    // conditionally build sql query
    let builder = contains('country').
        then(success(func(stmt => stmt.where('country', query.country)), ident)).
        then(contains('limit')).
        then(success(func(stmt => stmt.limit('limit', query.limit)), ident));

    // base query
    let stmt = db.select('rank', 'country', 'score', 'economy', 'family',
        'health', 'freedom', 'generosity', 'trust').
        from('rankings').
        orderBy('rank').
        where('year', req.params.year);

    let st = state(stmt, Object.keys(query));
    stmt = builder.run(st).state;

    let rows = await stmt;
    res.json(rows);
});


/* GET rankings */
router.get('/rankings', async (req, res, _next) => {
    let { db, query } = req;

    // validate parameters
    for (let i = 0; i < rankingsTests.length; i++) {
        let { test, message } = rankingsTests[i];
        if (!test(req)) {
            res.status(400).json({
                error: true,
                message
            });
            return;
        }
    }

    let builder = contains('country').
        then(success(
            func(
                stmt => stmt.where('country', query.country).orderBy('year', 'desc'),
            ),
            func(
                stmt => stmt.orderBy('year', 'desc').orderBy('rank', 'asc'),
            ))).
        then(contains('year')).
        then(success(func(stmt => stmt.where('year', query.year)), ident));

    // fetch data
    let stmt = db.select('rank', 'country', 'score', 'year').
        from('rankings');

    let st = state(stmt, Object.keys(query));
    stmt = builder.run(st).state;

    let rows = await stmt;
    res.json(rows)
});

/* Serve Swagger Docs */
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(specification));

module.exports = router;
