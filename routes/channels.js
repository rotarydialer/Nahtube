var express = require('express');
var router = express.Router();

/* GET list of allowed channels */
router.get('/', function(req, res, next) {
  
  (async () => {
      const { rows } = await pgpool.query(`
        SELECT u.username, ch.channel_name, ch.channel_id
        FROM nahtube.channels_allowed ch
        INNER JOIN nahtube.users u
          ON ch.user_id=u.id
        ORDER BY u.username, ch.channel_name`);

        console.log(rows.length + ' allowed channels.');

      return res.send(rows);
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});

router.get('/details', function(req, res, next) {
  console.log('Returning full channel details.');
  
  (async () => {
      const { rows } = await pgpool.query(`
        SELECT id, user_id, channel_id, channel_name, channel_data 
        FROM nahtube.channels_allowed`);

      return res.send(rows);
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))
});

router.get('/activity', function(req, res) {
  const username = req.session.user.username;
  const user_id = req.session.user.id;
  console.log(`Getting recent activity on subscribed channels for ${username}`);

  (async () => {
    const client = await pgpool.connect();

    try {
      
      await client.query('BEGIN');

      // Step 1 of 2: Get list of user's channels
      const userChannels = await client.query(`
        SELECT ch.channel_id
          FROM nahtube.channels_allowed ch
         INNER JOIN nahtube.users users
            ON ch.user_id = users.id
         WHERE users.id = $1
         ORDER BY ch.sort, ch.id;
      `, [user_id]);

      const channelList = userChannels.rows.map((channel) => {
        return channel.channel_id
      });

      // Step 2 of 2: make a call to the activities list for each:
      // https://developers.google.com/youtube/v3/docs/activities/list

      res.status(200);
      return res.send(channelList);

    } catch (e) {
      await client.query('ROLLBACK');
      const respCode = e.code ? e.code : 404
      server.log(['error'], e.message);

      res.status(respCode);
      return res.send({
          message: 'ERROR: ' + e.message
      });
    } finally {
        //client.release();
    }
    
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send(e.message);
  }))

});

router.get('/:username', function(req, res, next) {
  var username = req.params.username;
  
  (async () => {
      const { rows } = await pgpool.query(`
        SELECT u.username, ch.sort, ch.id, ch.channel_name, ch.channel_id, ch.channel_data
        FROM nahtube.channels_allowed ch
        INNER JOIN nahtube.users u
          ON ch.user_id=u.id
        WHERE u.username = $1
          AND ch.sort <= 10000
        ORDER BY u.username, ch.sort, ch.id`, [username]);

      if (rows.length) {
        console.log('Returning channels for "%s".', username);
        return res.send(rows);
      } else {
        console.log('BAD REQUEST for user "' + [username] + '".');
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