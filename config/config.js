var config = {};

config.application = {};
config.application.name = 'NahTube';

config.session = {};
config.session.secret = 'This string is used to compute the hash of the express-session and should be changed if you want to be secure.';

config.youtube = {};
config.youtube.key = 'thisneedstobereplacedwithyouryoutubedataAPIkey!';

config.database = {};
config.database.connectionString = 'postgresql://postgres@localhost/mydb';

module.exports = config;
