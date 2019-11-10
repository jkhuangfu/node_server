const request = require('request');
const fetchData = (url, method = 'GET', options = {}) => {
    return new Promise(resolve => {
        request(
            {
                url: url,
                method: method,
                json: true,
                encoding: null,
                headers: {
                    'content-type': 'application/json'
                },
                ...options
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve({status: 200, data: body, message: 'success'});
                } else {
                    resolve({status:  500, data: body, message: error});
                }
            }
        );
    });
};
module.exports = fetchData;
