const log4js = require('log4js');
log4js.configure({
    appenders: {
        ruleConsole: { type: 'console' },
        ruleFile: {
            type: 'dateFile',
            filename: '../logs/server-',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    pm2: true,
    categories: {
        default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' }
    }
});
const log = {};
exports.log = log;
const logDebug = log4js.getLogger('logDebug');
const logInfo = log4js.getLogger('logInfo');
const logWarn = log4js.getLogger('logWarn');
const logErr = log4js.getLogger('logErr');

log.Debug = msg => {
    if (msg == null)
        msg = "";
    logDebug.debug(msg);
};

log.Info = msg => {
    if (msg == null)
        msg = "";
    logInfo.info(msg);
};

log.Warn = msg => {
    if (msg == null)
        msg = "";
    logWarn.warn(msg);
};

log.writeErr = msg => {
    if (msg == null)
        msg = "";
    if (exp != null)
        msg += "\r\n" + exp;
    logErr.error(msg);
};