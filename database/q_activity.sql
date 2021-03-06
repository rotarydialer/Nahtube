﻿SELECT users.username, act.action, to_char(act.action_time - interval '5 hours', 'HH12:MI:SSam'), act.action_time, act.channel_id, ch.channel_name, act.details
FROM nahtube.user_activity act
   INNER JOIN nahtube.users users
	ON act.user_id = users.id
   LEFT JOIN nahtube.channels_allowed ch
	ON act.channel_id = ch.channel_id
WHERE act.action_time >= DATE(NOW()) - INTERVAL '1 DAY' * 3
ORDER BY action_time;

-- troubleshoot the rendering of a specific activity
SELECT act.id, users.common_name, act.action, act.action_time, act.channel_id, ch.channel_name, act.details, act.details_full
FROM nahtube.user_activity act
      INNER JOIN nahtube.users users
            ON act.user_id = users.id
      LEFT JOIN nahtube.channels_allowed ch
            ON act.channel_id = ch.channel_id
WHERE users.username = $1
AND act.action_time >= DATE(NOW()) - INTERVAL '1 DAY'
AND act.action = 'watch video'
AND act.id = 1525
ORDER BY action_time;

-- roll-up report of activity by type over the past week
SELECT action, date_trunc('day', action_time) as dt, count(action)
FROM nahtube.user_activity
WHERE date_trunc('day', action_time) >= current_date - INTERVAL '1 DAY' * 7
GROUP BY action, dt
ORDER BY action, dt DESC;

-- Summary report: videos watched by channel, by day, over the past week
SELECT DATE(date_trunc('day', act.action_time)) as dt, ch.channel_name, count(act.action) as ch_count
FROM nahtube.user_activity act
   INNER JOIN nahtube.channels_allowed ch
      ON ch.channel_id = act.channel_id
WHERE action = 'watch video'
AND date_trunc('day', act.action_time) >= current_date - INTERVAL '1 DAY' * 7
GROUP BY dt, ch.channel_name
ORDER BY dt DESC, ch_count DESC;

SELECT date_trunc('day', act.action_time)::date as date, ch.channel_name, count(act.action) as ch_count
FROM nahtube.user_activity act
   INNER JOIN nahtube.channels_allowed ch
      ON ch.channel_id = act.channel_id
WHERE action = 'watch video'
GROUP BY date, ch.channel_name
ORDER BY date DESC, ch_count DESC;

-- Summary: same as above, but include even channels that have not been added
SELECT act.channel_id, ch.channel_name, count(act.action) as ch_count
FROM nahtube.user_activity act
   LEFT JOIN nahtube.channels_allowed ch
      ON ch.channel_id = act.channel_id
WHERE action = 'watch video'
GROUP BY act.channel_id, ch.channel_name
ORDER BY ch_count DESC;

-- Summary: most watched channels over all time
SELECT ch.channel_name, count(act.action) as ch_count
FROM nahtube.user_activity act
   INNER JOIN nahtube.channels_allowed ch
      ON ch.channel_id = act.channel_id
WHERE action = 'watch video'
GROUP BY ch.channel_name
ORDER BY ch_count DESC;

-- messages to a given user in the last week
SELECT users_from.username, users_to.username as to, 
msg.message_time, msg.message_subject, msg.message_body,
msg.video_id, msg.details_full
FROM nahtube.user_messages msg
   INNER JOIN nahtube.users users_from
	ON msg.from_id = users_from.id
   INNER JOIN nahtube.users users_to
	ON msg.to_id = users_to.id
WHERE users_to.username = 'daughter'
AND msg.message_time >= DATE(NOW()) - INTERVAL '1 DAY' * 7
ORDER BY msg.message_time DESC;

-- report: daily watch counts per user, per day
WITH now_tz AS (
	select (date_trunc('day', now() AT TIME ZONE '+04')) AS todays_date
),

all_users AS (
	SELECT common_name, id, username FROM nahtube.users WHERE is_active
),
          
date_range AS (
        SELECT 
        generate_series('04-11-2018', 
		(SELECT todays_date FROM now_tz), 
		'1 day'::interval)::date AS arb_date
      ),
            
activity_dates AS (
	SELECT user_id,
	       date_trunc('day', a.action_time at time zone '+04') AS action_date,
	       count(a.action_time) AS watch_count
	  FROM nahtube.user_activity a
	 INNER JOIN nahtube.users u
		 ON a.user_id = u.id
	 WHERE a.action = 'watch video'
	 GROUP BY user_id, username, action_date
	 ORDER BY action_date, username
)

SELECT ad.arb_date, u.common_name, COALESCE(a.watch_count, 0) as count 
  FROM date_range ad
 CROSS JOIN all_users u
  LEFT JOIN activity_dates a
         ON (ad.arb_date = a.action_date AND a.user_id = u.id)
   ORDER BY arb_date, u.id;

-- user "grand" summary: all activity
SELECT u.common_name, u.id, u.username, a.action, COUNT(a.action_time) as action_total 
FROM nahtube.users u
INNER JOIN nahtube.user_activity a
      ON (u.id = a.user_id)
WHERE u.is_active
GROUP BY u.common_name, u.id, u.username, a.action
ORDER BY u.common_name, u.id, u.username, action_total DESC;