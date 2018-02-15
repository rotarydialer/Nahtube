var express = require('express');
var session = require('express-session');
var router = express.Router();

var activity = require('../activity');

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
        //console.log(req.session.user);
        activity.track('view messages', req.session.user.id);

        return res.render('messages', { 
            username: req.session.user.username,
            commonName: req.session.user.common_name
         });
    }
});

router.get('/inbox.json', function (req, res, next) {

    if (!isLoggedIn(req)) {
        return res.send().status(403);
    }

    var username = req.session.user.username;

    if (username) {

        (async () => {

            const { rows } = await pgpool.query(`SELECT msg.id, users_from.username as from, users_to.username as to, 
                msg.message_time, msg.message_subject, msg.message_body, msg.message_type, msg.video_id, msg.details_full
                FROM nahtube.user_messages msg
                INNER JOIN nahtube.users users_from
                ON msg.from_id = users_from.id
                INNER JOIN nahtube.users users_to
                ON msg.to_id = users_to.id
                WHERE users_to.username = $1
                AND NOT is_deleted
                ORDER BY msg.message_time DESC;`, 
                [username]);
        
            if (rows.length) {
                console.log('Returning details for messages to ' + username + '. Total: ' + rows.length);
                return res.send(rows);
            } else {
                console.log('No messages to ' + username + '.');
                res.status(400);
                return res.send();
            }
                            
        })().catch(e => setImmediate(() => { 
            //throw e 
            res.status(500);
            return res.send('Error: ' + e.message);
        } ))

    } else {
        res.send('Not logged in.').status(400);
    }

});

router.post('/send', function (req, res, next) {
    if (!isLoggedIn(req)) {
        return res.send('Not logged in.').status(401);
    } else {
        const {
            toUsername,
            subject,
            messageBody,
            videoId,
            detailsFull
        } = req.body;

        (async () => {

            const { rows } = await pgpool.query(`
            WITH userids as (SELECT id, username FROM nahtube.users)

            INSERT INTO nahtube.user_messages (
                from_id, to_id, message_subject, message_body, video_id, details_full
            )
            VALUES (
                (SELECT id FROM userids WHERE username=$1),
                (SELECT id FROM userids WHERE username=$2),
                $3,
                $4,
                $5,
                $6
            );`,
            [req.session.user.username, toUsername, subject, messageBody, videoId, detailsFull]);

            return res.send('Message sent.').status(200);

        })().catch(e => setImmediate(() => {
            res.status(500);
            console.log('Message send error:', e);
            return res.send('There was an error: ' + e);
        } ))

    }
});

module.exports = router;