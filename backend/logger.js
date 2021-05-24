const logger = require('morgan');

logger.token('req', (req, _res) => JSON.stringify(req.headers));
logger.token('res', (_req, res) => {
    const { statusCode, statusMessage } = res;
    return JSON.stringify({ statusCode, statusMessage });
});

module.exports = logger('common');
