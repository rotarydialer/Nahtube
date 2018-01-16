WITH userids as (SELECT id, username FROM nahtube.users)

INSERT INTO nahtube.user_messages (
	from_id, 
	to_id, 
	message_subject, 
	message_body, 
	channel_id, 
	video_id, 
	details_full
)
VALUES (
	(SELECT id FROM userids WHERE username='son'),
	(SELECT id FROM userids WHERE username='daughter'),
	'GUITAR',
	'{"messageBody": "I am Brother. I like guitar. Sister is good."}',
	'UCR39sLAZ5wS_vrMo4tRylHw',
	'6N_YJhE3vmw',
	'{"kind":"youtube#video","etag":"\"S8kisgyDEblalhHF9ooXPiFFrkc/0llaTIW-dQlA2R46Ip4csipLons\"","id":"6N_YJhE3vmw","snippet":{"publishedAt":"2014-09-07T06:34:59.000Z","channelId":"UCR39sLAZ5wS_vrMo4tRylHw","title":"Matthew McAllister plays Farewell to Stromness by Peter Maxwell Davies on a 2012 Stefan Nitschke","description":"Matthew McAllister plays Farewell to Stromness by Peter Maxwell Davies (Arr. Matthew McAllister) on a 2012 Stefan Nitschke.\nUs on Facebook: https://www.facebook.com/siccasguitars\nUs on Twitter: https://twitter.com/SiccasGuitars\nOur Website: http://www.siccasguitars.com","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/6N_YJhE3vmw/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/6N_YJhE3vmw/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/6N_YJhE3vmw/hqdefault.jpg","width":480,"height":360},"standard":{"url":"https://i.ytimg.com/vi/6N_YJhE3vmw/sddefault.jpg","width":640,"height":480},"maxres":{"url":"https://i.ytimg.com/vi/6N_YJhE3vmw/maxresdefault.jpg","width":1280,"height":720}},"channelTitle":"SiccasGuitars","tags":["Peter Maxwell Davies (Composer)","Farewell To Stromness","Music (TV Genre)","Television (Invention)","Matthew","Manuel Barrueco (Guitarist)","David Russel","David Russell (Guitarist)","Marcin Dylla (Guitarist)","Guitar (Musical Instrument)","Classical Guitar","Tatyana Ryzhkova","Matthew McAllister","Brandon","Kyle","Chris","Josh","Andrew","Luke","Dig","Christopher Titus (Musical Artist)","Musician (Profession)"],"categoryId":"10","liveBroadcastContent":"none","localized":{"title":"Matthew McAllister plays Farewell to Stromness by Peter Maxwell Davies on a 2012 Stefan Nitschke","description":"Matthew McAllister plays Farewell to Stromness by Peter Maxwell Davies (Arr. Matthew McAllister) on a 2012 Stefan Nitschke.\nUs on Facebook: https://www.facebook.com/siccasguitars\nUs on Twitter: https://twitter.com/SiccasGuitars\nOur Website: http://www.siccasguitars.com"}}}'
);