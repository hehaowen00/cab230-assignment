const express = require('express');
const router = express.Router({ strict: true });

/* Swagger */
const swaggerUI = require('swagger-ui-express');
const specification = require('../swagger.json');

const { AuthRequired } = require('../middleware/auth');
const { factorsTests, rankingsTests } = require('./tests');
const { state, contains, success, func, ident } = require('../util/combinators');

/* GET countries */
router.get('/countries', async (req, res, _next) => {
    let { db, query } = req;

    // check if query parameters were given
    if (Object.keys(query).length > 0) {
        res.status(400).json({
            error: true,
            message: 'Invalid query parameters. Query parameters are not permitted.'
        });
        return;
    }

    // get countries
    try {
        let rows = await db.distinct().select('country')
            .from('rankings')
            .orderBy('country');

        const results = rows.map(entry => entry.country);
        res.json(results);
    } catch (err) {
        res.status(500).json({
            error: true,
            message: 'Unable to fetch countries',
        });

        throw err;
    }
});

/* GET factors */
router.get('/factors/:year', AuthRequired, async (req, res, next) => {
    let { db, query } = req;

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
        then(success(func(stmt => stmt.limit(query.limit)), ident));

    // base query
    let stmt = db.select('rank', 'country', 'score', 'economy', 'family',
        'health', 'freedom', 'generosity', 'trust').
        from('rankings').
        orderBy('rank').
        where('year', req.params.year);

    // define combinator state
    let st = state(stmt, Object.keys(query));

    // get results from query
    let results = await builder.run(st).state;

    res.json(results);
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

    // combinator to check if query parameters were given and update sql query
    let builder = contains('country').
        then(success(
            func(stmt => stmt.where('country', query.country).orderBy('year', 'desc')),
            func(stmt => stmt.orderBy('year', 'desc').orderBy('rank', 'asc')))).
        then(contains('year').
            then(success(func(stmt => stmt.where('year', query.year)), ident)));

    // fetch data
    let stmt = db.select('rank', 'country', 'score', 'year').
        from('rankings');

    // define combinator state
    let base = state(stmt, Object.keys(query));

    // get results from query
    let results = await builder.run(base).state;

    res.json(results)
});

/* Serve Swagger Docs */
router.use('/', swaggerUI.serve);
router.get('/', swaggerUI.setup(specification));

module.exports = router;
