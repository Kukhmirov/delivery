module.exports = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({
            "error":"Необходима авторизация",
            "status":"error"
        });
    }
    next();
}

