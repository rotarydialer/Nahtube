module.exports = {
    track: function (action, userId, channelId, details) {
        if (!userId || !action) {
            console.log('Invalid parameters. ACTIVITY NOT LOGGED');
            return;
        }

        console.log('TRACK');
        console.log(' ├─> action: "%s"', action);
        console.log(' └─> userId: "%s"', userId);
        channelId ? console.log(' └─> channelId: "%s"', channelId) : '';
        details ? console.log(' └─> details: "%s"', details) : '';

        (async () => {
            
            const { rows } = await pgpool.query(`
            INSERT INTO nahtube.user_activity (user_id, action, channel_id, details) 
            VALUES ($1, $2, $3, $4);`,
                [userId, action, channelId, details]);
            if (rows) {
                console.log('Activity logged to database.');
            } else {
                console.log('Error saving user activity.');
            }
                    
        })().catch(e => setImmediate(() => { 
            //throw e 
            console.log("ERROR:", e.message);
            console.log('There was an error logging user activity.');
        } ))


    }
};