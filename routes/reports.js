var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get("/user/summary/activity/date/:dateToCheck?", function(req, res, next) {
  var checkDate = moment(req.params.dateToCheck || Date.now());

  (async () => {
    qresult = await pgpool.query(
      `
            SELECT users.common_name, act.action, count(act.id)
              FROM nahtube.users users
              LEFT JOIN nahtube.user_activity act
                ON act.user_id = users.id
             WHERE date_trunc('day', act.action_time)::date = $1
             GROUP BY users.common_name, act.action
             ORDER BY users.common_name, act.action;`,
      [checkDate]
    );

    var { rows } = qresult;

    var data = {};
    data.results = rows;

    if (rows.length) {
      rows.push();
      return res.send(data);
    } else {
      res.status(404);
      return res.send("No data found for the given date.");
    }
  })().catch(e =>
    setImmediate(() => {
      //throw e
      res.status(500);
      console.log(e);
      return res.send("Error: " + e.message);
    })
  );
});

router.get('/user/summary/videos/watched/date/:dateToCheck?', function (req, res, next) {
    
    var checkDate = moment(req.params.dateToCheck || Date.now());

    (async () => {
        qresult = await pgpool.query(`
          WITH all_users AS (
            SELECT common_name, id FROM nahtube.users WHERE is_active
          ),
          
          activity_by_day AS (
            SELECT users.common_name, users.id, date_trunc('day', act.action_time)::date as date, count(act.id) as count
              FROM nahtube.users users
              LEFT JOIN nahtube.user_activity act
                ON act.user_id = users.id
            WHERE action = 'watch video'
              AND date_trunc('day', act.action_time)::date = $1
            GROUP BY users.common_name, users.id, date
          )

          SELECT u.common_name, COALESCE(a.count, 0) as count from all_users u
          LEFT OUTER JOIN activity_by_day a
          ON u.id = a.id
          ORDER BY a.count DESC NULLS LAST, u.common_name;`,
          [checkDate]);

        var { rows } = qresult;

        var data = {};
        data.date = checkDate;
        data.results = rows;
  
        if (rows.length) {
          return res.send(data);
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