var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  (async () => {
      const { rows } = await pgpool.query(`
              SELECT id, username, common_name, roles 
              FROM nahtube.users
              ORDER BY roles ASC, username ASC`);

      return res.send(rows);
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});

router.get('/role/:role', function(req, res, next) {
 
  (async () => {
    var role = req.params.role;

    //console.log('Returning list of users with the role "' + role + '".');

    const { rows } = await pgpool.query(`
            SELECT id, username, common_name, roles 
            FROM nahtube.users
            WHERE roles @> ARRAY[$1]::varchar[]
            AND is_active
            ORDER BY common_name;`, [role]);

    if (rows.length) {
      //console.log('Returning list of users with the role "' + role + '".');
      return res.send(JSON.stringify(rows));
    } else {
      console.log('BAD REQUEST for role "' + role + '".');
      res.status(404);
      return res.send('No such user found.');
    }      
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    console.log(e);
    return res.send('Error: ' + e.message);
  } ));

});

router.get('/su', function(req, res, next) {
 
  (async () => {

    const { rows } = await pgpool.query(`
      SELECT id, username, common_name, roles 
      FROM nahtube.users
      WHERE (roles @> ARRAY['parent']::varchar[] AND is_active)
      OR (roles @> ARRAY['child']::varchar[] AND NOT is_active)
      ORDER BY roles DESC;`);

    if (rows.length) {
      return res.send(JSON.stringify(rows));
    } else {
      res.status(404);
      return res.send('/su: No such user found.');
    }      
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('Error: ' + e.message);
  } ));

});

router.get('/names', function(req, res, next) {  
  (async () => {
      const { rows } = await pgpool.query(`
              SELECT common_name
              FROM nahtube.users
              ORDER BY common_name`);

      return res.send(rows);
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});

router.get('/:username.json', function(req, res, next) {
  var username = req.params.username;

  (async () => {
      const { rows } = await pgpool.query(`
              SELECT id, username, common_name, roles 
              FROM nahtube.users
              WHERE username = $1
              LIMIT 1;`,[username]);

      if (rows.length) {
        return res.send(rows[0]);
      } else {
        console.log('BAD REQUEST for user "' + [username] + '".');
        res.status(404);
        return res.send('No such user found.');
      }      
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    console.log(e);
    return res.send('Error: ' + e.message);
  } ));

});

router.get('/actiontypes/:username', function(req, res, next) {
  var username = req.params.username;

  (async () => {
      const { rows } = await pgpool.query(`
        SELECT act.action
        FROM nahtube.user_activity act
          INNER JOIN nahtube.users users
              ON act.user_id = users.id
        WHERE users.username = $1
        GROUP BY action
        ORDER BY action;`,[username]);

      var actions = rows.map((row) => row.action);

      if (rows.length) {
        //return res.send(rows);
        return res.send(actions);
      } else {
        console.log('BAD REQUEST for user "' + [username] + '".');
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

router.get('/id/:userid.json', function(req, res, next) {
 
  (async () => {
    var userid = req.params.userid;

      const { rows } = await pgpool.query(`
              SELECT id, username, common_name, roles 
              FROM nahtube.users
              WHERE id = $1
              LIMIT 1;`, [userid]);

      if (rows.length) {
        //console.log('Returning details for user id "' + userid + '".');
        return res.send(rows[0]);
      } else {
        console.log('BAD REQUEST for user "' + userid + '".');
        res.status(404);
        return res.send('No such user found.');
      }      
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    console.log(e);
    return res.send('Error: ' + e.message);
  } ));
  
});

router.get('/created/:daysAgo', function(req, res, next) {
  var daysAgo = req.params.daysAgo;

   (async () => {
       const { rows } = await pgpool.query(`
          SELECT id, username, common_name, roles, created FROM nahtube.users 
           WHERE DATE(created) <= DATE(NOW()) - INTERVAL '1 DAY' * $1;`, 
           [daysAgo]);
 
       if (rows.length) {
         console.log('Returning details for users created ' + [daysAgo] + ' days ago. Total: ' + rows.length);
         return res.send(rows);
       } else {
         console.log('BAD REQUEST for users created ' + [daysAgo] + ' days ago.');
         res.status(404);
         return res.send('No such user found.');
       }
 
               
   })().catch(e => setImmediate(() => { 
     //throw e 
     res.status(500);
     console.log(e);
     return res.send('Error: ' + e.message);
   } ))
 
 
 });

 // TODO: secure this with an identity check
 router.get('/messages/to/:toUsername/:daysAgo?', function(req, res, next) {
   var toUsername = req.params.toUsername;
   var daysAgo = req.params.daysAgo;

      (async () => {

       if (daysAgo) {

          const { rows } = await pgpool.query(`SELECT users_from.username as from, users_to.username as to, 
            msg.message_time, msg.message_subject, msg.message_body, msg.video_id, msg.details_full
            FROM nahtube.user_messages msg
              INNER JOIN nahtube.users users_from
              ON msg.from_id = users_from.id
              INNER JOIN nahtube.users users_to
              ON msg.to_id = users_to.id
            WHERE users_to.username = $1
            AND msg.message_time >= DATE(NOW()) - INTERVAL '1 DAY' * $2
            ORDER BY msg.message_time DESC;`, 
            [toUsername, daysAgo]);
    
          if (rows.length) {
            console.log('Returning details for messages to ' + toUsername + ' sent in the last ' + [daysAgo] + ' days. Total: ' + rows.length);
            return res.send(rows);
          } else {
            console.log('No messages to ' + toUsername + ' sent in the last ' + [daysAgo] + ' days.');
            res.status(200);
            return res.send();
          }

        } else {

          const { rows } = await pgpool.query(`SELECT users_from.username as from, users_to.username as to, 
            msg.message_time, msg.message_subject, msg.message_body, msg.video_id, msg.details_full
            FROM nahtube.user_messages msg
              INNER JOIN nahtube.users users_from
              ON msg.from_id = users_from.id
              INNER JOIN nahtube.users users_to
              ON msg.to_id = users_to.id
            WHERE users_to.username = $1
            ORDER BY msg.message_time DESC;`, 
            [toUsername]);
    
          if (rows.length) {
            console.log('Returning details for messages to ' + toUsername + '. Total: ' + rows.length);
            return res.send(rows);
          } else {
            console.log('No messages to ' + toUsername + '.');
            res.status(200);
            return res.send();
          }
          
        }
                      
      })().catch(e => setImmediate(() => { 
        //throw e 
        res.status(500);
        console.log(e);
        return res.send('Error: ' + e.message);
      } ))
      
  });

module.exports = router;
