var config = require('../config/config');
var googleAuth = require('google-auth-library');
var auth = new googleAuth();
var google = require('googleapis');
var youtube_base = google.youtube('v3');

var express = require('express');
var router = express.Router();

var YouTubeNode = require('youtube-node');
var youtube_node = new YouTubeNode();
youtube_node.setKey(config.youtube.key);

/* Setup and check the YT client */
router.get('/', function(req, res, next) {

  // test search
  youtube_node.search('palestrina', 5, function(error, result) {
    if (error) {
      console.log(error);
      res.status(500);
      return res.send(error);
    }
    else {
      return res.send(result);
    }
  });

});

// search with the youtube_node helper
router.post('/search', function(req, res, next) {
  var searchval = JSON.stringify(req.body);

  youtube_node.search(searchval, 15, function(error, result) {
    if (error) {
      console.log(error);
      res.status(500);
      return res.send(error);
    }
    else {
      console.log('Found %d results for "%s".', result.items.length, searchval);
      return res.send(result);
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

router.get('/videos/:channelId', function(req, res, next) {
  var channelId = req.params.channelId;

  var channelparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails',
    id: channelId
  };

  var playlistId;

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
      console.log('This channel\'s ID is %s. Its title is \'%s\'.',
                  channels[0].id,
                  channels[0].snippet.title);

      console.log('Uploads playlist ID: ' + channels[0].contentDetails.relatedPlaylists.uploads);
      playlistId = channels[0].contentDetails.relatedPlaylists.uploads;

      var playlistparams = {
        auth: config.youtube.key,
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 10
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
          return res.send(response);
        }
      });

    }
  }); 
  
});

// ---- WORKING EXAMPLE ------ START //
function getYoutubePlaylist(playlistId, res) {
  var reqparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails',
    playlistId: playlistId,
    maxResults: 10
  };
  
  youtube_base.playlistItems.list(reqparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return err;
    }
    var playlist = response.items;
    if (playlist.length == 0) {
      console.log('No results');
      return 'No results';
    } else {
      console.log('Found ' + playlist.length + ' videos in playlist.');

      //return playlist;
      return res.send(playlist);
    }
  });
}

router.get('/videosawait', async (req, res, next) => {
  try {
    await getYoutubePlaylist('UUiBvuoKHWkW62kM0H5OakRA', res);

  } catch (e) {
    console.log('Await error: ' + e);
    res.status(404);
    return res.send('await error: ' + e);
  }
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
      console.log('ERROR: No channel found for id "' + username + '".');
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

module.exports = router;