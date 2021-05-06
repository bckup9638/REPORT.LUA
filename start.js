const Discord = require("discord.js");

const client = new Discord.Client();

const prefix = "!";

client.on("message", function(message) {
    if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

//
const SteamAPI = require('steamapi');
const steam = new SteamAPI('SteamApiKey');

// Calculam ziua de azi
var currentdate = new Date(); 
var datetime = "" + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + " @ "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + "" 
// Calculam ziua de azi
//

  if (command === "report") {

//Luam SteamID64
steam.resolve(args[0]).then(id => {
    console.log(id);
//Luam SteamID64

//Whitelist


if(id == 76561198199933915){ // Legend
    message.reply('This SteamID64 is whitelisted.');
     return
 }
if(id == 76561199078487004){ // kmko
    message.reply('This SteamID64 is whitelisted.');
     return
 }
	
		if(id == 76561197989458001){ // ave
    message.reply('This SteamID64 is whitelisted.');
     return
 }
//Whitelist

// PORNESTE REPORTBOTU
var childProcess = require('child_process');
function runScript(scriptPath, callback) {
var invoked = false;
var process = childProcess.fork(scriptPath, [id, [20]]);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
    });

    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
    });

}



runScript('./index.js', function (err) {
    
    console.log('finished running some-script.js');
});
// PORNESTE REPORTBOTU

// PRINT PE DISCORD

//Luam chestii dp steam
steam.getUserSummary(id).then(summary => {
//Luam chestii dp steam

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Success')	
    .setThumbnail(`${summary.avatar.medium}`)
	.setDescription(`Successfully reportbotted[ ${summary.nickname}](https://steamcommunity.com/profiles/${args[0]})`)
	.setTimestamp()
	.setFooter('Steam ReportBot', 'https://media.tenor.com/images/8d1518011d1ed7bcfee1431043e4c231/tenor.gif');

message.reply(exampleEmbed);
});
});

}

});

client.login("DiscordBotToken");
