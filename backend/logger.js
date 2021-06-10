const logger = require('morgan');

logger.token('req', (req, _res) => JSON.stringify(req.headers));
logger.token('res', (_req, res) => {
    const headers = {}
    res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
    return JSON.stringify(headers)
});

module.exports = logger('common');
