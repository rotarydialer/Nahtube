var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres@localhost/nahdb'
});

global.pgpool = pool;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'NahTube' });
});


module.exports = router;
