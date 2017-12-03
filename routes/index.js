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

// user login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'NahTube' });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  (async () => {
    const { rows } = await pgpool.query(`
            SELECT id, username, common_name, roles 
            FROM nahtube.users
            WHERE username = $1
            LIMIT 1;`,[username]);

    if (rows.length) {
      console.log('login successful for "%s".', username);
      return res.status(200).send();
    } else {
      console.log('login NOT AUTHORIZED: "%s"', username);
      return res.status(401).send();
    }      
  })().catch(e => 
    setImmediate(() => { 
    res.status(500);
    console.log(e);
    return res.send('Error: ' + e.message);
    } 
  ));



});

module.exports = router;
