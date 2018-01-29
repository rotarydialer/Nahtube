var express = require('express');
var session = require('express-session');
var router = express.Router();

function isLoggedIn(req) {
  if (req.session.user) {
    return true;
  } else {
    return false;
  }
}

router.get('/', function (req, res, next) {
    if (!isLoggedIn(req)) {
        console.log('redirecting to login...');
        res.redirect('/login');
    } else {
        console.log(req.session.user);
        return res.render('messages', { 
            username: req.session.user.username,
            commonName: req.session.user.common_name
         });
    }
});

router.get('/inbox', function (req, res, next) {
    var username = req.params.username;

    (async () => {

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
            res.status(400);
            return res.send();
        }
                        
       })().catch(e => setImmediate(() => { 
         //throw e 
         res.status(500);
         console.log(e);
         return res.send('Error: ' + e.message);
       } ))

});

module.exports = router;