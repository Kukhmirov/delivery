const express = require("express");
const router = express.Router();
const controllers = require("../controllers");


router.post('/api/signin', controllers.user.signin);

router.post('/api/signup', controllers.user.signup);

router.get("/api/signin/me", controllers.user.getCurrentUser);

router.get('/api/signin/logout', controllers.user.logaut);


module.exports = router;