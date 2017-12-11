module.exports = {
    track: function (action, userId, channelId, details) {
        console.log('TRACK');
        console.log(' ├─> action: "%s"', action);
        console.log(' └─> userId: "%s"', userId);
        channelId ? console.log(' └─> channelId: "%s"', channelId) : '';
        details ? console.log(' └─> details: "%s"', details) : '';
    }
};

// var userId = req.params.userId;
// var action = req.params.action;

// console.log('payload: ' + req.payload);
  
// if (!userId) {
//     res.status(500);
//     return res.send('No user specified');
// }

// if (!action) {
//     res.status(500);
//     return res.send('No action specified');
// }

// (async () => {
    
//     const { rows } = await pgpool.query(`
//     INSERT INTO nahtube.user_activity (channel_id, user_id, channel_name, channel_data) 
//     VALUES (
//         $1, 
//         $2,
//         $3,
//         $4
//         );`,
//         [channelId, username, channels[0].snippet.title, JSON.stringify(channels[0])]);
    
//     return res.send().status(200);
            
// })().catch(e => setImmediate(() => { 
//     //throw e 
//     res.status(500);
//     return res.send('There was an error.');
// } ))