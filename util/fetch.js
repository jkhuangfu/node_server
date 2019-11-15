const request = require('request');
const fetchData = (url, method = 'GET', options = {
    json: true,
    headers: {
        'content-type': 'application/json'
    }
}) => {
    return new Promise(resolve => {
        request(
            {
                url: url,
                method: method,
                ...options
            },
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    resolve({status: 200, data: body, message: 'success'});
                } else {
                    resolve({status: 500, data: body, message: error});
                }
            }
        );
    });
};
module.exports = fetchData;
