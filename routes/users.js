var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Users, you say?');
  
  (async () => {
      const { rows } = await pgpool.query(`
              SELECT username, password, common_name, roles 
              FROM nahtube.users`);

      return res.send(JSON.stringify(rows));
              
  })().catch(e => setImmediate(() => { 
    //throw e 
    res.status(500);
    return res.send('There was an error.');
  } ))


});

module.exports = router;
