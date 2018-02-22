WITH activity AS
  (
    SELECT
      users.username,
      date_trunc('day', act.action_time)::date as date,
      act.action_time as actiontime,
      LEAD(users.username) OVER (ORDER BY act.action_time) AS nexttype,
      LEAD(act.action_time) OVER (ORDER BY act.action_time) AS nextdate
    FROM nahtube.user_activity act
   INNER JOIN nahtube.users users
      ON act.user_id = users.id
   WHERE
          act.action_time >= '2015-01-01 00:00:00.00'
      AND act.action_time <  '2020-01-01 23:59:59.59'
  )
  
SELECT
  activity.username, activity.date,
  SUM(EXTRACT(EPOCH FROM (nextdate - actiontime))) AS duration_seconds
FROM
  activity
GROUP BY username, date
ORDER BY username, date;