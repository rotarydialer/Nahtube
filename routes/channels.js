var express = require('express');
var router = express.Router();

/* GET list of allowed channels */
router.get('/', function(req, res, next) {
  console.log('Allowed channels, you say?');
  
  (async () => {
      const { rows } = await pgpool.query(`
        SELECT u.username, ch.channel_name, ch.channel_id
        FROM nahtube.channels_allowed ch
        INNER JOIN nahtube.users u
          ON ch.user_id=u.id
        ORDER BY u.username`);

      return res.send(JSON.stringify(rows));
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});

router.get('/details', function(req, res, next) {
  console.log('Allowed channels, you say?');
  
  (async () => {
      const { rows } = await pgpool.query(`
        SELECT id, user_id, channel_id, channel_name, channel_data 
        FROM nahtube.channels_allowed`);

      return res.send(JSON.stringify(rows));
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});


router.get('/:username', function(req, res, next) {
  console.log('Allowed channels for "' + req.params.username + '", you say?');
  
  (async () => {
      const { rows } = await pgpool.query(`
        SELECT u.username, ch.channel_name, ch.channel_id
        FROM nahtube.channels_allowed ch
        INNER JOIN nahtube.users u
          ON ch.user_id=u.id
        WHERE u.username = $1
        ORDER BY u.username`, [req.params.username]);

      if (rows.length) {
        console.log('Returning channel details for user "' + [req.params.username] + '".');
        return res.send(JSON.stringify(rows));
      } else {
        console.log('BAD REQUEST for user "' + [req.params.username] + '".');
        res.status(404);
        return res.send('No allowed channels found for that user.');
      }
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});

module.exports = router;