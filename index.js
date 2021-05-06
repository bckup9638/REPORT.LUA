const steamCommunity = require('steamcommunity');
const steamTotp = require('steam-totp');
const colors = require('colors');
const path = require("path");
var async = require('async');
var fs = require("fs");
let config = null;

var community = new steamCommunity();
var text = fs.readFileSync("./bots.txt").toString('utf-8');
var bot = text.split("\n")
config = require(path.resolve("config.json"));
let configRaw = fs.readFileSync("./config.json").toString();
const id = process.argv[2]
const perChunk = config.perChunk;
const betweenChunks = config.betweenChunks;
const limited = config.limited;
console.log('Catre: %s'.gray, id);

var allSuccess = 0;
var allFailed = 0;



(async() => {
	// Getting chunks:
    let subbot = []; 
	if (process.argv[3] != 0) bot.length = process.argv[3];
	for (let i = 0; i <Math.ceil(bot.length/perChunk); i++){
		subbot[i] = bot.slice((i*perChunk), (i*perChunk) + perChunk);
	}
	
	console.log('Total %s accounts and %s chunks'.cyan, bot.length, subbot.length);
	for (let ii = 0; ii < subbot.length; ii++) {
		
		var success = 0;
		var failed = 0;	

		async.each(subbot[ii], function(item, callback){
				if (!limited) {
					const logOnOptions = {
						accountName: item.split(":")[0],
						password: item.split(":")[1],
						twoFactorCode: steamTotp.generateAuthCode(item.split(":")[2]),
					};  

					community.login({
						"accountName": logOnOptions.accountName,
						"password": logOnOptions.password,
						"twoFactorCode": logOnOptions.twoFactorCode
						},
						function (err, sessionID, cookies, steamguard, oAuthToken) {
							if (err) { console.log('Nu am putut sa ne locam pe contul [%s] (Eroare: %s)'.red, logOnOptions.accountName, err); failed++; allFailed++; callback(); }
							if (!err) {
								(async() => {
													
								console.log('Ne-am logat cu success pe [%s] cod sesiune [%s]'.yellow, logOnOptions.accountName, sessionID);
								var options = {
									formData: {	sessionid: sessionID, json: 1, abuseID: id, eAbuseType: 14, abuseDescription: 'This account was stolen by someone and the owner lost access to the mail and to the account.', ingameAppID: config.appid },
									headers: { Cookie: cookies, Host: 'steamcommunity.com', Origin: 'https://steamcommunity.com' },
									json: true
								};
											
									community.httpRequestPost(
										'https://steamcommunity.com/actions/ReportAbuse/', options,
										function (err, res, data) {
											if (err) {
												console.log('err', err); failed++; allFailed++;
											}
											if (!err) {
											 if (data == 1) { console.log(`[${process.argv[2]}] a fost raportat de catre [%s] cu sucess am primit codul: %s`.green, logOnOptions.accountName, data); success++; allSuccess++;}
											 else if (data == 25) { console.log('[%s] A fost deja raportat am primit codul: %s'.red, logOnOptions.accountName, data); failed++; allFailed++; }
											 else { console.log('[%s] Ceva nu a mers bine, am primit codul: %s'.red, logOnOptions.accountName, data); failed++; allFailed++;}
											callback();
											}
										},
										"steamcommunity"
									);
								
								
								})();
							}
					});
				};	
				if (limited) {
					const logOnOptions = {
						accountName: item.split(":")[0],
						password: item.split(":")[1]		
					};  

					community.login({
						"accountName": logOnOptions.accountName,
						"password": logOnOptions.password
						},
						function (err, sessionID, cookies, steamguard, oAuthToken) {
							if (err) { console.log('Nu am putut sa ne locam pe contul [%s] (Eroare: %s)'.red, logOnOptions.accountName, err); failed++; allFailed++; callback(); }
							if (!err) {
								(async() => {			
								console.log('Ne-am logat cu success pe [%s] cod sesiune [%s]'.yellow, logOnOptions.accountName, sessionID);
								var options = {
									formData: {	sessionid: sessionID, json: 1, abuseID: id, eAbuseType: 14, abuseDescription: 'This account was stolen by someone and the owner lost access to the mail and to the account.', ingameAppID: config.appid },
									headers: { Cookie: cookies, Host: 'steamcommunity.com', Origin: 'https://steamcommunity.com' },
									json: true
								};
											
									community.httpRequestPost(
										'https://steamcommunity.com/actions/ReportAbuse/', options,
										function (err, res, data) {
											if (err) {
												console.log('err', err); failed++; allFailed++;
											}
											if (!err) {
											 if (data == 1) { console.log(`[${process.argv[2]}] a fost raportat de catre [%s] cu sucess am primit codul: %s`.green, logOnOptions.accountName, data); success++; allSuccess++;}
											 else if (data == 25) { console.log(`[${process.argv[2]}] A fost deja raportat am primit codul: %s`.red,  data); failed++; allFailed++; }
											 else { console.log('[%s] Ceva nu a mers bine, am primit codul: %s'.red, logOnOptions.accountName, data); failed++; allFailed++;}
											callback();
											}
										},
										"steamcommunity"
									);
								
								
								})();
							}
					});
					
				};				
		}, function(err) {
				console.log('Chunkul cu numarul %s a terminat: am avut %s raportari cu success si %s raportari esuate.'.white, ii + 1, success, failed);
				if (ii < subbot.length - 1) console.log('Asteptam %s ms pana la urmatorul chunk'.cyan, betweenChunks);
		});
		if (ii < subbot.length) await new Promise(r => setTimeout(r, betweenChunks));
	};
    console.log('Raportari cu succes %s si %s raportari esuate.'.black.bgWhite, allSuccess, allFailed)
	

})();