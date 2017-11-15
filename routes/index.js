var express = require('express');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({             // TODO: remove hardcoding
    user: 'postgres',
    host: 'localhost',
    database: 'nahdb',
    password: 'ohsosecureartthou',
    port: 5432,
  });
  global.pgpool = pool;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'NahTube' });
});


module.exports = router;
