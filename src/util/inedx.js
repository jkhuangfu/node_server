const CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';
const get_char = (n) => {
    return CHARS.charAt((n >> 0) % CHARS.length);
};

const uuid = (c = 48, prefix = '', toLower = false) => {
    let r = '';
    while(c > 0){
        r += get_char(Math.random()*1e4);
        c--;
    }
    r = prefix + r;
    if(toLower){
        r = r.toLowerCase();
    }
    return r;
};

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
    },
    uuid
};
