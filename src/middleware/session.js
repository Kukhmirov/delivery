const session = require('express-session');

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true
});

module.exports = {session, sessionMiddleware};