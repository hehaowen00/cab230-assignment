const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const express = require('express');
var router = express.Router();

const { secret_key, isAuthorized } = require('./util/auth');

/* POST login */
router.post('/login', async function(req, res, next) {
    const required = ['email', 'password'];
    const { db, body } = req;

    for (let i = 0; i < required.length; i++) {
        if (!(required[i] in body)) {
            res.status(400).json({
                error: true,
                message: 'Request body incomplete, both email and password are required'
            });
            return;
        }
    }

    let rows = await db.select('password').from('users').where('email', body.email);
    if (rows.length === 0) {
        res.status(401).json({
            error: true,
            message: 'Incorrect email or password'
        });
        return;
    }

    let { password } = rows[0];

    if (await bcrypt.compare(body.password, password)) {
        const expires_in = 60 * 60 * 24;
        const exp = Date.now() + expires_in * 1000;
        const token = jwt.sign({ email: req.body.email, exp }, secret_key);

        res.json({
            token,
            token_type: 'Bearer',
            expires_in
        });

        return;
    }

    res.status(401).json({
        error: true,
        message: 'Incorrect email or password'
    });
});

/* POST register  */
router.post('/register', async (req, res, next) => {
    const required = ['email', 'password'];
    const { db, body } = req;

    for (let i = 0; i < required.length; i++) {
        if (!(required[i] in body)) {
            res.status(400).json({
                error: true,
                message: 'Request body incomplete, both email and password are required'
            });
            return;
        }
    }

    const { email, password } = req.body;
    const saltRounds = 12;

    let hashed = bcrypt.hashSync(password, saltRounds);
    let rows = await db.select('email').from('users').where('email', email);

    if (rows.length) {
        res.status(409).json({
            error: true,
            message: 'User already exists'
        });
        return;
    }

    try {
        const rows = await db('users').insert({ email, password: hashed });
        res.status(201).json({
            message: 'User created'
        });
    } catch (err) {
        throw err;
    }
});

const optionalAuth = (req, res, next) => {
    req.authorized = req.headers.authorization ? true : false;
    if (req.authorized) {
        isAuthorized(req, res, next);
    } else {
        next();
    }
}

/* GET profile */
router.get('/:email/profile', optionalAuth, async (req, res, next) => {
    const { email } = req.params;
    const { db, authorized } = req;

    let stmt = db.select('email', 'firstName', 'lastName');

    if (authorized && req.decoded.email === email) {
        stmt = db.select('email', 'firstName', 'lastName', 'dob', 'address');
    }

    let rows = await stmt.from('users').where('email', email);

    if (rows.length === 0) {
        res.status(404).json({
            error: true,
            message: 'User not found'
        });

        return;
    }

    if ('dob' in rows[0] && rows[0].dob !== null) {
        let result = rows[0];
        let newDob = moment(result.dob).format('YYYY-MM-DD');
        res.json({ ...result, dob: newDob });
    } else {
        res.json(rows[0]);
    }

});

router.put('/:email/profile', isAuthorized, async (req, res, next) => {
    const { email } = req.params;
    const { db, body } = req;
    const { firstName, lastName, dob, address } = body;

    if (req.decoded.email !== email) {
        res.status(403).json({
            error: true,
            message: 'Forbidden'
        });
        return;
    }

    const required = {
        'firstName': 'string',
        'lastName': 'string',
        'dob': null,
        'address': 'string',
    };

    for (const key in required) {
        const received = body[key];
        if (received === undefined) {
            res.status(400).json({
                error: true,
                message: 'Request body incomplete: firstName, lastName, dob and address are required.'
            });
            return;
        }

        const expected = required[key];
        if (expected && typeof received !== expected) {
            res.status(400).json({
                error: true,
                message: 'Request body invalid, firstName, lastName and address must be strings only.'
            });
            return;
        }
    }

    // validate date format
    if (!moment(dob, 'YYYY-MM-DD').isValid() || dob.length !== 10) {
        res.status(400).json({
            error: true,
            message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.'
        });
        return;
    }

    // check if date is before now
    if (moment(dob).isAfter(moment())) {
        res.status(400).json({
            error: true,
            message: 'Invalid input: dob must be a date in the past.'
        });
        return;
    }

    // re-export date format
    const dateString = moment(dob).format('YYYY-MM-DD');

    await db('users').update({ firstName, lastName, dob: dateString, address })
        .where('email', email);

    let rows = await db.select('email', 'firstName', 'lastName', 'dob', 'address')
        .from('users').where('email', email);

    // check if user exists
    if (rows.length === 0) {
        res.status().json({
            error: true,
            message: 'User not found'
        });
        return;
    }

    let result = rows[0];
    let newDob = moment(result.dob).format('YYYY-MM-DD');
    res.json({ ...result, dob: newDob });
});

module.exports = router;
