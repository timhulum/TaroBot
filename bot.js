var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

//Modify Date() function
Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    var spawnTime1 = 0;
    var role1ID = '682302864307257345';
    var serverID = '647942335631589396';

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'help':
              bot.sendMessage({
                  to: channelID,
                  message: '```!help    display this message\n!utc    current utc time\n!sitedone   starts a timer for next spawn and pings @timer role\n!timerrole   adds the @timer role\n!notimerrole   removes the @timer role```'
              });
              break;
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: '<@&682149298368282655>'
                });
                break;
            case 'utc':
              time = new Date().toUTCString();
              //time = time.substring(0, (time.length-3));
              time = time + " (UTC)";
              bot.sendMessage({
                to: channelID,
                message: time
              });
              break;
            case 'sitedone':
              if (spawnTime1 == 0){
                spawnTime1 = new Date().addHours(1.33).toUTCString();
                bot.sendMessage({
                  to: channelID,
                  message: "```New spawn at:\n" + spawnTime1 + "\npinging @timer in 1:30```"
                });
                setTimeout(function(){bot.sendMessage({
                  to: '682305475521413145',
                  message: '<@&'+role1ID+'> new spawn (should) be up in 2 minutes!'
                })}, 5280000);
              } else {
                bot.sendMessage({
                  to: channelID,
                  message: 'You already have a timer set!'
                });
              }
              break;
            case 'timerrole':
              bot.addToRole({serverID:serverID, userID: userID, roleID: role1ID}, (err, res) => {
   console.log(err)
});
              bot.sendMessage({to: channelID, message: 'You have been added to the @timer role!'});
              break;
            case 'notimerrole':
              bot.removeFromRole({serverID:serverID, userID: userID, roleID:role1ID}, (err, res) => {
   console.log(err)
  });
              bot.sendMessage({to: channelID, message: 'You have been removed from the @timer role ;('});
              break;
            // Just add any case commands if you want to..
         }
     }
});
