var express = require('express');
var router = express.Router();

function isParentLoggedIn(req) {
    if (req.session.user) {
      //console.log('Logged in as "%s".', req.session.user.username);
      return true;
    } else {
      //console.log('Not logged in.');
      return false;
    }
  }

router.get('/', function (req, res, err) {
    res.render('parents/dashboard', { title: 'NahTube' });
});

router.get('/activity', function (req, res, err) {
    res.render('parents/activity');
});

router.get('/activity.json', function(req, res, next) {
 
    (async () => {
        var { rows } = await pgpool.query(`
            SELECT users.username, users.id, users.common_name, act.action, act.action_time, act.channel_id, ch.channel_name, act.details
            FROM nahtube.user_activity act
            INNER JOIN nahtube.users users
                ON act.user_id = users.id
            LEFT JOIN nahtube.channels_allowed ch
                ON act.channel_id = ch.channel_id
            ORDER BY action_time
            LIMIT 10000;`);
  
        if (rows.length) {
          return res.send(rows);
        } else {
          res.status(404);
          return res.send('No activity found.');
        }      
    })().catch(e => setImmediate(() => { 
      //throw e 
      res.status(500);
      console.log(e);
      return res.send('Error: ' + e.message);
    } ));
});

router.get('/activity/type/:action.json', function(req, res, next) {
    var action = req.params.action;
 
    (async () => {
            var { rows } = await pgpool.query(`
                SELECT users.username, users.id, users.common_name, act.action, act.action_time, act.channel_id, ch.channel_name, act.details
                FROM nahtube.user_activity act
                INNER JOIN nahtube.users users
                    ON act.user_id = users.id
                LEFT JOIN nahtube.channels_allowed ch
                    ON act.channel_id = ch.channel_id
                WHERE act.action = $1
                ORDER BY action_time;`, [action]);
  
        if (rows.length) {
          return res.send(rows);
        } else {
          console.log('BAD REQUEST for action type "' + action + '".');
          res.status(404);
          return res.send('No activity for action type "' + action + '" found.');
        }      
    })().catch(e => setImmediate(() => { 
      //throw e 
      res.status(500);
      console.log(e);
      return res.send('Error: ' + e.message);
    } ));
    
  });

router.get('/activity/:username.json', function(req, res, next) {
    var username = req.params.username;
    var startTime = req.query.s;
 
    (async () => {
        //var rows;
  
        //if (!startTime) {
            var { rows } = await pgpool.query(`
                SELECT users.username, users.id, users.common_name, act.action, act.action_time, act.channel_id, ch.channel_name, act.details
                FROM nahtube.user_activity act
                INNER JOIN nahtube.users users
                    ON act.user_id = users.id
                LEFT JOIN nahtube.channels_allowed ch
                    ON act.channel_id = ch.channel_id
                WHERE users.username = $1
                ORDER BY action_time;`, [username]);
        // } else {
        //     { rows } = await pgpool.query(`
        //         SELECT users.username, users.common_name, act.action, act.action_time, act.channel_id, ch.channel_name, act.details
        //         FROM nahtube.user_activity act
        //         INNER JOIN nahtube.users users
        //             ON act.user_id = users.id
        //         LEFT JOIN nahtube.channels_allowed ch
        //             ON act.channel_id = ch.channel_id
        //         WHERE users.username = $1
        //         AND act.action_time >= '2018-01-04'
        //         ORDER BY action_time;`, [username]);
        // }
  
        if (rows.length) {
          return res.send(rows);
        } else {
          console.log('BAD REQUEST for username "' + username + '".');
          res.status(404);
          return res.send('No activity for user found.');
        }      
    })().catch(e => setImmediate(() => { 
      //throw e 
      res.status(500);
      console.log(e);
      return res.send('Error: ' + e.message);
    } ));
    
  });

module.exports = router;