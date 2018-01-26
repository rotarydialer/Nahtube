var express = require('express');
var session = require('express-session');
var config = require('../config/config');
var router = express.Router();

// activity tracking functions
var activity = require('../activity');

function isLoggedIn(req) {
  if (req.session.user) {
    //console.log('Logged in as "%s".', req.session.user.username);
    return true;
  } else {
    //console.log('Not logged in.');
    return false;
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.returnTo = req.path; 

  if (!isLoggedIn(req)) {
    res.redirect('/login');
  } else {
    activity.track('dashboard', req.session.user.id);

    res.render('dashboard', { title: req.session.user.common_name, loggedinuser: req.session.user.username, userObject: req.session.user });
  }

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
    var referer = req.query.r; // ?r=youtube/videos/UCRAoFQwuyOUd10Lio8eppTg
  
  res.render('login', { title: 'NahTube', referer: referer });
});

router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var referer = req.body.referer;

  var routeTo = '/';

  if (referer) {
    console.log('Coming from "%s"', referer);
    routeTo = referer;
  }

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

      activity.track('login', req.session.user.id);
      //return res.redirect('/');
      return res.redirect(routeTo);
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

router.post('/logout', function(req, res, next) {
  activity.track('logout', req.session.user.id);
  //req.logout();
  delete req.user;
  req.session.destroy(function (err) {
    if (err) { 
      return next(err); 
    }
    // The response should indicate that the user is no longer authenticated.
    //return res.send({ authenticated: req.isAuthenticated() });

    // let the home route handle the login or whatever
    return res.redirect('/login');
  });
});

module.exports = router;
