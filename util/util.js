module.exports = {
    extend: function(target, source, flag) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) flag ? (target[key] = source[key]) : (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },
    reqBody:(req)=>{
        let method = req.method;
        let param = req.query || req.params;
        let body = req.body;
        return method === 'GET' ? param : body;
    }
};