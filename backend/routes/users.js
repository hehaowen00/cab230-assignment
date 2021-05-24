const bcrypt = require('bcrypt');
const express = require('express');
var router = express.Router();

/* POST login */
router.post('/login', async function(req, res, next) {
    const required = ['email', 'password'];
    const { db, body } = req;
    const error401 = (res) => {
        res.status(401).json({
            error: true,
            message: 'Incorrect email or password'
        });
    };

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
        error401();
        return;
    }

    let { password } = rows[0];

    if (bcrypt.compare(body.password, password)) {
        res.json({
            token: '',
            token_type: '',
            expires_in: ''
        });
        return;
    }

    error401();
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

module.exports = router;
