const express = require("express");

const userRouter = require("./user");

const router = express.Router();

router.use("/api/user", userRouter);

module.exports = router;