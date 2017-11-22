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
      console.log(JSON.stringify(result, null, 20));
      return res.send(JSON.stringify(result, null, 20));
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

      console.log(JSON.stringify(channels[0]));
      return res.send(response);
    }
  });
  
    // I'd prefer to call it thus:
    //getChannelById('UCV40LtJ8v2pO3_fYy0wJ2rw');

  // or with async:
  // (async () => {
  //   console.log('In dat async');

  //   // I want to do it this way but...
  //   const { chresp } = await getChannelById('UCV40LtJ8v2pO3_fYy0wJ2rw');

  //   console.log('After dat awaitness.');

  //   console.log('chresp be like >>>' + chresp + '<<<');

  //   return res.send(chresp);

  // })().catch(e => setImmediate(() => { throw e } ));
  
});

router.get('/user/:username', function(req, res, next) {
  var username = req.params.username;

  var listparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails,statistics',
    forUsername: username
  };

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
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);

      console.log(JSON.stringify(channels[0]));
      return res.send(response);
    }
  });
});

router.get('/videos', function(req, res, next) {
  var playlistId = 'UUiBvuoKHWkW62kM0H5OakRA';
  //var playlistId = ['UUiBvuoKHWkW62kM0H5OakRA','UUV40LtJ8v2pO3_fYy0wJ2rw'];

  var reqparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails',
    playlistId: playlistId,
    maxResults: 50
  };

  youtube_base.playlistItems.list(reqparams, function(err, response) {
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
      console.log('playlist:',
                  playlists);

      console.log(JSON.stringify(playlists));
      return res.send(response);
    }
  });
  
});

function getCrapFromYoutube(res) {
//var getCrapFromYoutube = async function() {
  var playlistId = 'UUiBvuoKHWkW62kM0H5OakRA'; //e.g., uploaded videos
  //var playlistId = 'FLV40LtJ8v2pO3_fYy0wJ2rw'; //e.g., "liked" videos

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
  // attempt at https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
  // this works BUT... referring to 4. Stack Frames here: https://blog.sessionstack.com/how-javascript-works-event-loop-and-the-rise-of-async-programming-5-ways-to-better-coding-with-2f077c4438b5
  try {
    console.log('Oh I\'m trying!');

    var ytresult = await getCrapFromYoutube(res); // <-- I don't wanna bury it in here, but I have to (?)

    console.log('Post await.');
    console.log('ytresult: ' + ytresult);

    //return res.send(ytresult); // <-- I want to await and send when it returns

  } catch (e) {
    console.log('Await error: ' + e);
    res.status(404);
    return res.send('await error: ' + e);
    //next(e);
  }
});

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel() {
  console.log('Getting channel details by name...');
  var service = google.youtube('v3');
  service.channels.list({
    auth: config.youtube.key,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'Zooniversity1'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);

      console.log(JSON.stringify(channels[0]));
    }
  });
}

function getChannelById(someChannelId) {
  console.log('Getting channel details by ID...');

  var listparams = {
    auth: config.youtube.key,
    part: 'snippet,contentDetails,statistics',
    id: someChannelId
  };

  var service = google.youtube('v3');
  service.channels.list(listparams, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.items;
    if (channels.length == 0) {
      console.log('No channel found.');
      return;
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);

      console.log(JSON.stringify(channels[0]));
      return response;
    }
  });
}

module.exports = router;