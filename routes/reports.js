var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/user/videos/watched/date/:dateToCheck?', function (req, res, next) {
    
    var checkDate = moment(req.params.dateToCheck || Date.now());

    (async () => {
        qresult = await pgpool.query(`
            SELECT users.common_name, date_trunc('day', act.action_time)::date as date, count(act.id)
              FROM nahtube.users users
              LEFT JOIN nahtube.user_activity act
                ON act.user_id = users.id
             WHERE action = 'watch video'
               AND date_trunc('day', act.action_time)::date = $1
             GROUP BY users.common_name, date;`,
            [checkDate]);

        var { rows } = qresult;
  
        if (rows.length) {
          return res.send(rows);
        } else {
          res.status(404);
          return res.send('No data found for the given date.');
        }      
    })().catch(e => setImmediate(() => { 
      //throw e 
      res.status(500);
      console.log(e);
      return res.send('Error: ' + e.message);
    } ));
});

module.exports = router;