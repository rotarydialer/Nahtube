SELECT users.username, act.action, to_char(act.action_time - interval '5 hours', 'HH12:MI:SSam'), act.action_time, act.channel_id, ch.channel_name, act.details
FROM nahtube.user_activity act
   INNER JOIN nahtube.users users
	ON act.user_id = users.id
   LEFT JOIN nahtube.channels_allowed ch
	ON act.channel_id = ch.channel_id
WHERE act.action_time >= DATE(NOW()) - INTERVAL '1 DAY' * 3
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