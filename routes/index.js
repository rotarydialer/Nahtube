var express = require('express');
var session = require('express-session');
var router = express.Router();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres@localhost/nahdb'
});

global.pgpool = pool;

function isLoggedIn(req) {
  if (req.session.user) {
    console.log('Logged in as "%s".', req.session.user.username);
    return true;
  } else {
    console.log('Not logged in.');
    return false;
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.returnTo = req.path; 

  if (isLoggedIn(req)) {

  }
  console.log(req.session.user);

  res.render('dashboard', { title: 'NahTube', username: req.session.common_name });
});

router.get('/checksession', function(req, res, next) {
  if (!req.session) {
    res.status(401);
    return res.send('No session!');
  } else {
    console.log('Session id: %s', req.session.id);
  }

  if (!req.session.user) {
    console.log('Session found, but user not logged in');
    res.status(401);
    return res.send('Found a session, but you\'re not logged in.');
  } else {
    console.log('User #%d logged in: "%s"', req.session.user.id, req.session.user.username);
    return res.send(req.session.user);
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
      console.log(' └─> id: %d, common name: "%s", roles: %s ', req.session.user.id, req.session.user.common_name, req.session.user.roles.toString());
      return res.redirect('/');
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
