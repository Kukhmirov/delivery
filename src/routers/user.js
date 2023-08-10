const express = require("express");
const router = express.Router();
const controllers = require("../controllers");


router.get('/', controllers.user.getUsers);

router.post('/', (req, res) => {
    res.json('sss')
})

router.put('/', (req, res) => {
    console.log(111);
    res.json('sss')
})

router.delete('/', (req, res) => {
    console.log(111);
    res.json('sss')
})


module.exports = router;