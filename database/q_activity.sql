SELECT users.username, act.action, to_char(act.action_time - interval '5 hours', 'HH12:MI:SSam'), act.action_time, act.channel_id, ch.channel_name, act.details
FROM nahtube.user_activity act
   INNER JOIN nahtube.users users
	ON act.user_id = users.id
   LEFT JOIN nahtube.channels_allowed ch
	ON act.channel_id = ch.channel_id
WHERE act.action_time >= '2017-12-28'
ORDER BY action_time;

-- roll-up report of activity by type over the past week
SELECT action, date_trunc('day', action_time) as dt, count(action)
FROM nahtube.user_activity
WHERE date_trunc('day', action_time) >= current_date - INTERVAL '1 DAY' * 7
GROUP BY action, dt
ORDER BY action, dt DESC;