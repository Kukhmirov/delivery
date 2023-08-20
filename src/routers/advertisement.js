const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const authCheck = require('../middleware/auth');
const fileMiddleWare = require('../middleware/file');



router.get('/', controllers.advertisement.findAdvertisement);

router.get('/:id', controllers.advertisement.getAdvertisementById);

router.post(
    '/',
    authCheck,
    fileMiddleWare.array('images', 3),
    controllers.advertisement.createAdvertisement);

router.post(
    '/:id',
    authCheck,
    controllers.advertisement.editAdvertisementById);


module.exports = router;