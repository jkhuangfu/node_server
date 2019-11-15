const crypto = require('crypto');
const hash = (content, type) => {
    const hash = crypto.createHash(type);
    hash.update(content);
    return hash.digest('hex');
};
module.exports = hash;
