const validateCountry = ({ country }) => country ? /^[a-zA-z\s]*$/.test(country) : true;
const validateLimit = ({ limit }) => limit ? /^[0-9]+$/.test(limit) : true;
const validateParams = validItems => query => Object.keys(query).
    filter(el => !validItems.includes(el)).length === 0;
const validateYear = ({ year }) => year ? /^[0-9]{4}$/.test(year) : true;

const queryTest = f => req => f(req.query);
const paramTest = f => req => f(req.params);

const rankingsTests = [
    {
        test: queryTest(validateParams(['country', 'year'])),
        message: 'Invalid query parameters. Only year and country are permitted.'
    },
    {
        test: queryTest(validateCountry),
        message: 'Invalid country format. Country query parameter cannot contain numbers.'
    },
    {
        test: queryTest(validateYear),
        message: 'Invalid year format. Format must be yyyy.'
    }
];

const factorsTests = [
    {
        test: queryTest(validateParams(['country', 'limit'])),
        message: 'Invalid query parameters. Only limit and country are permitted.'
    },
    {
        test: paramTest(validateYear),
        message: 'Invalid year format. Format must be yyyy.'
    },
    {
        test: queryTest(validateCountry),
        message: 'Invalid country format. Country query parameter cannot contain numbers.'
    },
    {
        test: queryTest(validateLimit),
        message: 'Invalid limit query. Limit must be a positive number.'
    }
];

module.exports = {
    factorsTests,
    rankingsTests
}
