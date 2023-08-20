const fs = require("fs");
const os = require("os");

module.exports = (req, res, next) => {
    const dateNow = Date.now();
    const { url, method } = req;
    console.log(req);

    const data = `${dateNow}${method}${url}`;
    fs.appendFile("server.log", data + os.EOL, (err) => {
        if(err) throw err;
    });

    next();
};