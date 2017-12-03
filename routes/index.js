var express = require('express');
var session = require('express-session');
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

router.get('/checksession', function(req, res, next) {
  if (!req.session) {
    res.status(401);
    return res.send('No session!');
  } else {
    console.log('session id: %s', req.session.id);
  }

  if (!req.session.user) {
    console.log('Session found, but user not logged in');
    res.status(401);
    return res.send('Found a session, but you\'re not logged in.');
  } else {
    console.log('User #%d logged in: "%s"', req.session.user.id, req.session.user.username);
    return res.send('You are logged in as "' + req.session.user.username + '".');
  }

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
      req.session.user = rows[0];
      console.log(' --> id: %d, name: %s ', req.session.user.id, req.session.user.username);
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
