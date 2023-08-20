const express = require("express");

const authUser = require("./authUser");
const advertisementRouter = require("./advertisement");

const router = express.Router();

router.use("/", authUser);
router.use('/api/advertisements', advertisementRouter);

module.exports = router;