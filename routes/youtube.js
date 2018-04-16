var config = require('../config/config');
var googleAuth = require('google-auth-library');
var auth = new googleAuth();
var google = require('googleapis');
var youtube_base = google.youtube('v3');

var express = require('express');
var session = require('express-session');
var router = express.Router();

var activity = require('../activity');

var YouTubeNode = require('youtube-node');
var youtube_node = new YouTubeNode();
youtube_node.setKey(config.youtube.key);

function isLoggedIn(req) {
  if (req.session.user) {
    //console.log('Logged in as "%s".', req.session.user.username);
    return true;
  } else {
    //console.log('Not logged in.');
    return false;
  }
}

function checkLoginAndRedirect(req, res) {
  if (!isLoggedIn(req)) {
    var referer = req.originalUrl;

    refQstr = referer ? '?r=' + referer : '';

    console.log('Redirecting to "%s"', ('/login' + refQstr));

    return res.redirect('/login' + refQstr);
  }
}

router.get('/', function(req, res, next) {
  req.session.returnTo = req.path; 

  if (!isLoggedIn(req)) {
    res.render('dashboard', { title: siteName, loggedinuser: '' });
  } else {
    activity.track('dashboard', req.session.user.id);

    res.render('dashboard', { title: req.session.user.common_name, loggedinuser: req.session.user.username, userObject: req.session.user });
  }
});

// search with the youtube api
router.post('/search', function(req, res, next) {
  var searchstr = req.body.searchstring;
  
    if(!isLoggedIn(req)) {
      res.status(401);
      return res.send('ERROR: Not authorized. User must login.');
    }

  var searchparams = {
    auth: config.youtube.key,
    part: 'snippet',
    type: 'video',
    safeSearch: 'strict',
    maxResults: 28,
    q: searchstr
  };

  activity.track('search', req.session.user.id, '', JSON.stringify({"searchstring": searchstr}) );

  youtube_base.search.list(searchparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var results = response.items;
    if (results.length == 0) {
      console.log('ERROR: No results found for id "' + searchstr + '".');
      res.status(404);
      return res.send('ERROR: No results found for id "' + searchstr + '".');
    } else {
      console.log('Found %d results for "%s".', results.length, searchstr);

      return res.send(response);
    }
  }); 

});

router.get('/channel/search/:searchstring', function(req, res, next) {
  var searchstr = req.params.searchstring;
  
    if(!isLoggedIn(req)) {
      res.status(401);
      return res.send('ERROR: Not authorized. User must login.');
    }

  var searchparams = {
    auth: config.youtube.key,
    part: 'snippet',
    type: 'channel',
    safeSearch: 'strict',
    maxResults: 30,
    q: searchstr
  };

  youtube_base.search.list(searchparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var results = response.items;
    if (results.length == 0) {
      console.log('ERROR: No results found for "' + searchstr + '".');
      res.status(404);
      return res.send('ERROR: No results found for "' + searchstr + '".');
    } else {
      console.log('Found %d results for "%s".', results.length, searchstr);

      console.log(results);

      return res.send(response);
    }
  }); 

});

router.get('/search/:searchstring', function(req, res, next) {
  var searchstr = req.params.searchstring;
  
    if(!isLoggedIn(req)) {
      res.status(401);
      return res.send('ERROR: Not authorized. User must login.');
    }

  var searchparams = {
    auth: config.youtube.key,
    part: 'snippet',
    type: 'video',
    safeSearch: 'strict',
    maxResults: 28,
    q: searchstr
  };

  activity.track('search - get', req.session.user.id, '', JSON.stringify({"searchstring": searchstr}) );

  youtube_base.search.list(searchparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var results = response.items;
    if (results.length == 0) {
      console.log('ERROR: No results found for id "' + searchstr + '".');
      res.status(404);
      return res.send('ERROR: No results found for id "' + searchstr + '".');
    } else {
      console.log('Found %d results for "%s".', results.length, searchstr);

      return res.send(response);
    }
  }); 

});

// Test using the YouTube API directly
router.get('/direct/:channelId', function(req, res, next) {
  var channelId = req.params.channelId;

  var listparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails,statistics',
    id: channelId
  };

  // ultimately, call playlistItems.list
  // https://developers.google.com/youtube/v3/docs/playlistItems
  // the parameter from this will be found in the channels data under
  // items.contentDetails.relatedPlaylists.uploads
  // good reference: https://www.youtube.com/watch?v=jdqsiFw74Jk&t=178s
  youtube_base.channels.list(listparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.items;
    if (channels.length == 0) {
      console.log('ERROR: No channel found for id "' + channelId + '".');
      res.status(404);
      return res.send('No channel found for id "' + channelId + '".');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);

      //console.log(JSON.stringify(channels[0]));
      return res.send(response);
    }
  });  
});

router.get('/user/:ytuser', function(req, res, next) {
  var ytuser = req.params.ytuser;

  var listparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails,statistics',
    forUsername: ytuser
  };

  youtube_base.channels.list(listparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.items;
    if (channels.length == 0) {
      console.log('ERROR: No channel found for YouTube username "' + ytuser + '".');
      res.status(404);
      return res.send('No channel found for YouTube username "' + ytuser + '".');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);

      //console.log(JSON.stringify(channels[0]));
      return res.send(response);
    }
  });
});

router.get('/videos/:channelId.json', function(req, res, next) {
  var channelId = req.params.channelId;
  var pageToken = req.query.pageToken || '';

  var channelparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails',
    id: channelId
  };

  var playlistId;
  var channelTitle;

  youtube_base.channels.list(channelparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.items;
    if (channels.length == 0) {
      console.log('ERROR: No channel found for id "' + channelId + '".');
      res.status(404);
      return res.send('No channel found for id "' + channelId + '".');
    } else {
      channelTitle = channels[0].snippet.title
      console.log('This channel\'s ID is %s. Its title is \'%s\'.',
                  channels[0].id,
                  channelTitle);

      //console.log('Uploads playlist ID: ' + channels[0].contentDetails.relatedPlaylists.uploads);
      playlistId = channels[0].contentDetails.relatedPlaylists.uploads;

      var playlistparams = {
        auth: config.youtube.key,
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        pageToken: pageToken
      };

      youtube_base.playlistItems.list(playlistparams, function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var playlists = response.items;
        if (playlists.length == 0) {
          console.log('ERROR: No playlist found for id "' + playlistId + '".');
          res.status(404);
          return res.send('No playlist found for id "' + playlistId + '".');
        } else {
          response.channelTitle = channelTitle;
          return res.send(response);
        }
      });

    }
  }); 
  
});

router.get('/videos/:channelId', function(req, res, next) {

  checkLoginAndRedirect(req, res);

  // if (!isLoggedIn(req)) {
  //   var referer = req.originalUrl;

  //   refQstr = referer ? '?r=' + referer : '';

  //   console.log('Redirecting to "%s"', ('/login' + refQstr));

  //   return res.redirect('/login' + refQstr);
  // }

  activity.track('list videos', req.session.user.id, req.params.channelId);

  res.render('videos', { title: req.session.user.common_name, channelId: req.params.channelId });

});

router.get('/watch', function(req, res, next) {
  checkLoginAndRedirect(req, res);

  var videoId = req.query.v;
  var channelId = req.query.c;
  var startTime = req.query.t || ''; //e.g., &t=125; TODO: translate from "&t=2m05s"
  var logAct = req.query.logact || ''; // TODO: remove/rework this, as it's a weakness

  if (logAct != 'no') activity.track('watch video', req.session.user.id, channelId, JSON.stringify({"videoId": videoId}));

  res.render('watch', { 
    title: req.session.user.common_name, 
    videoId: videoId || '',
    startParam: startTime ? '&start=' + startTime : ' ' 
  });

});

router.post('/watch', function(req, res, next) {
  checkLoginAndRedirect(req, res);

  console.log('POST watch handler');
  console.log(req.body.videoDetailsFull);

  var videoId = req.query.v;
  var channelId = req.query.c || '';
  var videoDetailsFull = req.body.videoDetailsFull || '';
  var startTime = req.query.t || '';  //e.g., &t=125; TODO: translate from "&t=2m05s"
  var channelTitle = '';
  var videoTitle = '';
  if (req.body) {
    if (videoDetailsFull && videoDetailsFull != '{}') {
      if (typeof(videoDetailsFull)==='string') {
        videoDetailsFull = JSON.parse(videoDetailsFull);
      }
      channelTitle = videoDetailsFull.snippet.channelTitle;
      videoTitle = videoDetailsFull.snippet.title || '';
    }
  }

  activity.track('watch video', req.session.user.id, channelId, JSON.stringify({"videoId": videoId}), videoDetailsFull);

  res.render('watch', { 
    title: req.session.user.common_name, 
    videoId: videoId || '', 
    videoTitle: videoTitle, 
    channelTitle: channelTitle, 
    channelId: channelId,
    startParam: startTime ? '&start=' + startTime : ' '
  });

});

router.post('/save/:channelId/:username', function(req, res, next) {
  var channelId = req.params.channelId;
  var username = req.params.username;

  var listparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails,statistics',
    id: channelId
  };
  
  if (!channelId) {
    res.status(500);
    return res.send('No channel id specified');
  }
  
    if (!username) {
      res.status(500);
      return res.send('No user specified');
    }

  youtube_base.channels.list(listparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.items;
    if (channels.length == 0) {
      console.log('ERROR: No channel found for id "' + channelId + '".');
      res.status(404);
      return res.send('No channel found for id "' + username + '".');
    } else {
      // console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
      //             'it has %s views.',
      //             channels[0].id,
      //             channels[0].snippet.title,
      //             channels[0].statistics.viewCount);

      console.log('Saving "%s" as an allowed channel for %s.', channels[0].snippet.title, username);

      (async () => {
        
        const { rows } = await pgpool.query(`
        INSERT INTO nahtube.channels_allowed (channel_id, user_id, channel_name, channel_data) 
        VALUES (
            $1, 
            (SELECT id FROM nahtube.users WHERE username = $2),
            $3,
            $4
            )
        ON CONFLICT (channel_id, user_id) DO UPDATE
            SET channel_name = $3, channel_data = $4;`,
              [channelId, username, channels[0].snippet.title, JSON.stringify(channels[0])]);
        
        //console.log(JSON.stringify(channels[0]));
        return res.send(response);
                
      })().catch(e => setImmediate(() => { 
        //throw e 
        res.status(500);
        return res.send('There was an error.');
      } ))

    }
  });
});

router.get('/related/:videoId', function(req, res, next) {
  var videoId = req.params.videoId;

  console.log('Searching for videos related to %s', videoId);
  
    if(!isLoggedIn(req)) {
      res.status(401);
      return res.send('ERROR: Not authorized. User must login.');
    }

  var searchparams = {
    auth: config.youtube.key,
    part: 'snippet',
    relatedToVideoId: videoId,
    type: 'video',
    safeSearch: 'strict',
    maxResults: 50
  };

  youtube_base.search.list(searchparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var results = response.items;
    if (results.length == 0) {
      console.log('ERROR: No related videos found.');
      res.status(404);
      return res.send('ERROR: No related videos found.');
    } else {
      console.log(' -- Found %d related videos.', results.length);

      return res.send(response);
    }
  }); 

});

router.get('/videodetails/:videoId', function(req, res, next) {
  var videoId = req.params.videoId;
  
  if(!isLoggedIn(req)) {
    res.status(401);
    return res.send('ERROR: Not authorized. User must login.');
  }

  //console.log('Getting details for video id "%s"...', videoId);

  var searchparams = {
    auth: config.youtube.key,
    part: 'snippet',
    id: videoId
  };

  youtube_base.videos.list(searchparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var results = response.items;
    if (results.length == 0) {
      console.log('ERROR: No video found with the ID "' + videoId + '".');
      res.status(404);
      return res.send('ERROR: No video found with that ID.');
    } else {
      return res.send(response);
    }
  }); 

});

module.exports = router;