var express = require('express');
var router = express.Router();

router.get('/', function (req, res, err) {

    return res.send('Hello, parent');
});

module.exports = router;