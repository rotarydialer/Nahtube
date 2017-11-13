var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Users, you say?');
  
  (async () => {
      const { rows } = await pgpool.query(`
              SELECT username, common_name, roles 
              FROM nahtube.users`);

      return res.send(JSON.stringify(rows));
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))


});

router.get('/:username.json', function(req, res, next) {
 
  (async () => {
      const { rows } = await pgpool.query(`
              SELECT username, common_name, roles 
              FROM nahtube.users
              WHERE username = $1
              LIMIT 1;`,[req.params.username]);

      if (rows.length) {
        console.log('Returning details for user "' + [req.params.username] + '".');
        return res.send(JSON.stringify(rows[0]));
      } else {
        console.log('BAD REQUEST for user "' + [req.params.username] + '".');
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

router.get('/created/:daysAgo', function(req, res, next) {

   (async () => {
       const { rows } = await pgpool.query(`
          SELECT id, username, common_name, roles, created FROM nahtube.users 
           WHERE DATE(created) <= DATE(NOW()) - INTERVAL '1 DAY' * $1;`, 
           [req.params.daysAgo]);
 
       if (rows.length) {
         console.log('Returning details for users created ' + [req.params.daysAgo] + ' days ago. Total: ' + rows.length);
         return res.send(JSON.stringify(rows));
       } else {
         console.log('BAD REQUEST for users created ' + [req.params.daysAgo] + ' days ago.');
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

module.exports = router;
