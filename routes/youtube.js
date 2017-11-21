var config = require('../config/config');
var fs = require('fs');
var readline = require('readline');
var googleAuth = require('google-auth-library');
var auth = new googleAuth();
var google = require('googleapis');
var youtube_base = google.youtube('v3');

var express = require('express');
var router = express.Router();

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
// var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
//  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
//      process.env.USERPROFILE) + '/config/';
//  var TOKEN_DIR = 'config/';
//  var TOKEN_PATH = TOKEN_DIR + 'credentials.json';

// Load client secrets from a local file.
// fs.readFile(TOKEN_DIR + 'client_secret.json', function processClientSecrets(err, client_secret) {
//   if (err) {
//     console.log('Error loading client secret file: ' + err);
//     return;
//   }
//   // Authorize a client with the loaded credentials, then call the YouTube API.

//   authorize(JSON.parse(client_secret), function () {
//     console.log('Client authorized.');
//     console.log('Secret: ' + client_secret);
//   });
// });

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



/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
  console.log('Getting channel details by name...');
  var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
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