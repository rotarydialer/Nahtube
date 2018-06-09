var express = require('express');
var router = express.Router();
var moment = require('moment');

// TODO: handle more generically/elegantly
var timezoneparam = '-04';
let timeZoneEastern = '+04'; // TODO: buggy results from the above on certain queries... check logic

router.get("/user/summary/activity/date/:dateToCheck?", function(req, res, next) {
  var checkDate = moment(req.params.dateToCheck || Date.now());

  (async () => {
    qresult = await pgpool.query(
      `
            SELECT users.common_name, act.action, count(act.id)
              FROM nahtube.users users
              LEFT JOIN nahtube.user_activity act
                ON act.user_id = users.id
             WHERE date_trunc('day', act.action_time at time zone $2)::date = $1
             GROUP BY users.common_name, act.action
             ORDER BY users.common_name, act.action;`,
      [checkDate.utc(), timezoneparam]
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
            SELECT common_name, id, username FROM nahtube.users WHERE is_active
          ),
          
          activity_by_day AS (
            SELECT users.common_name, users.id, date_trunc('day', act.action_time at time zone $2)::date as date, count(act.id) as count
              FROM nahtube.users users
              LEFT JOIN nahtube.user_activity act
                ON act.user_id = users.id
            WHERE action = 'watch video'
              AND date_trunc('day', act.action_time at time zone $2)::date = $1
            GROUP BY users.common_name, users.id, date
          )

          SELECT u.common_name, COALESCE(a.count, 0) as count from all_users u
          LEFT OUTER JOIN activity_by_day a
          ON u.id = a.id
          ORDER BY u.id;`,
          [checkDate.utc(), timezoneparam]);

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

router.get("/user/summary/:username", function (req, res, next) {

  const { username } = req.params;

  (async () => {
    qresult = await pgpool.query(
      `
      WITH dates_watched AS (
          SELECT u.username AS username,
                 date_trunc('day', a.action_time at time zone $2) AS action_date,
                 count(a.action_time) AS watch_count
            FROM nahtube.user_activity a
           INNER JOIN nahtube.users u
              ON a.user_id = u.id
           WHERE a.action = 'watch video'
           GROUP BY username, action_date
           ORDER BY username, action_date
      )
      
      SELECT action_date, watch_count 
        FROM dates_watched
       WHERE username=$1
      `,[username, timezoneparam]
    );

    var { rows } = qresult;

    var data = {};
    data.results = rows;

    if (rows.length) {
      return res.send(data);
    } else {
      res.status(404);
      return res.send("No data found for the given user.");
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

router.get("/user/watchcount/:username/:startdate", function (req, res, next) {

  const { username, startdate } = req.params;

  (async () => {
    qresult = await pgpool.query(
      `WITH  now_tz AS (
        select (date_trunc('day', NOW() AT TIME ZONE $3)) AS todays_date
      ),
      
      date_range AS (
        SELECT 
          generate_series($2,
            (SELECT todays_date FROM now_tz), 
            '1 day'::interval)::date AS arb_date
      ),
            
      activity_dates AS (
        SELECT u.username AS username,
               date_trunc('day', a.action_time) AS action_date,
               count(a.action_time) AS watch_count
          FROM nahtube.user_activity a
         INNER JOIN nahtube.users u
                 ON a.user_id = u.id
         WHERE a.action = 'watch video'
           AND u.username=$1
         GROUP BY username, action_date
         ORDER BY username, action_date
    )
    
    SELECT d.arb_date AS action_date, COALESCE(a.watch_count, 0) AS watch_count FROM date_range d
      LEFT JOIN activity_dates a 
             ON d.arb_date = a.action_date;
      `,[username, startdate, timeZoneEastern]
    );

    var { rows } = qresult;

    var data = {};
    data.results = rows;

    if (rows.length) {
      return res.send(data);
    } else {
      res.status(404);
      return res.send("No data found for the given user/date.");
    }
  })().catch(e =>
    setImmediate(() => {
      //throw e
      res.status(500);
      console.error(e);
      return res.send("Error: " + e.message);
    })
  );
});

router.get("/now", function(req, res, next) {
  (async () => {
    qresult = await pgpool.query(
      'SELECT NOW();'
    );
    
    var { rows } = qresult;

    var data = {};
    data.results = rows;

    if (rows.length) {
      data['time'] = 'server time';
      return res.send(data);
    } else {
      res.status(404);
      return res.send("Error getting database time.");
    }

  })().catch(e =>
    setImmediate(() => {
      //throw e
      res.status(500);
      console.error(e);
      return res.send("Error: " + e.message);
    })
  );
});

module.exports = router;