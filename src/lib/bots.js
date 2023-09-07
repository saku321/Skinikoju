'use strict'

const config = require('../config')
const async = require('async')
const fs = require('fs')
const Trade = require('./trade')
const axios = require("axios");
const SteamUser = require('steam-user')
const SteamCommunity = require('steamcommunity')
const SteamTotp = require('steam-totp')
const TradeOfferManager = require('steam-tradeoffer-manager')
const GlobalOffensive = require('globaloffensive')



const { confirmOffer } = require('../servers/dbServer');


Trade.prototype.startBots = async function startBots(done) {
    
            const response = await axios.get(`https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${config.steamApiKey}`);
            const logon = response.data.result.perfectworld.logon;
            const purchase = response.data.result.perfectworld.purchase;

            if (logon.availability === "online" && logon.latency === "normal" && purchase.availability === "online" && purchase.latency === "normal") {



                const self = this
                let count = 0
                async.eachOfSeries(config.bots, (bot, id, callback) => {

                    count += 1
                    const client = new SteamUser({
                        dataDirectory: null,
                    })
                    const csgo = new GlobalOffensive(client)
                    self.instances[id] = {
                        client,
                        csgo,
                        community: new SteamCommunity(),
                        manager: new TradeOfferManager({
                            steam: client,
                            domain: config.domain,
                            language: 'en',
                            cancelTime: 600000,
                        }),
                        login: {
                            accountName: bot.accountName,
                            password: bot.accountPas,
                            twoFactorCode: SteamTotp.getAuthCode(bot.twoFactorCode),
                        },
                        user: bot,
                    }
                    // identifiers
                    self.instances[id].client.bot_id = id
                    self.instances[id].community.bot_id = id
                    self.instances[id].manager.bot_id = id
                    // polldata
                    if (fs.existsSync(`./polls/${id}.json`)) {
                        self.instances[id].manager.pollData = JSON.parse(fs.readFileSync(`./polls/${id}.json`))
                    }
                    // login
                    self.instances[id].client.logOn(self.instances[id].login)
                    self.instances[id].client.addListener('webSession', (sessionID, cookies) => {
                        self.instances[id].manager.setCookies(cookies, (err) => {
                            if (err) {
                                return callback(err)
                            }
                            return true
                        })
                        self.instances[id].community.setCookies(cookies)
                        self.instances[id].community.startConfirmationChecker(20000, 'dsa');
                        // Initialize CS:GO
                        self.instances[id].client.setPersona(SteamUser.EPersonaState.Online);

                        self.instances[id].client.gamesPlayed([config.appID])
                    })


                    self.instances[id].manager.on('pollData', (data) => {
                        if (!fs.existsSync(`./polls`)) {
                            fs.mkdir('./polls', (err) => {
                                if (err) throw Error(err, console.log("[FAILURE] Couldn't create POLLS folder, please create manually"))
                            })
                        } else {
                            console.log('[SKIPPING] The Folder Already Exists.')
                        }

                        if (!fs.existsSync(`./polls/BotEventss.json`)) {
                            fs.writeFile(`./polls/BotEventss.json`, JSON.stringify(data), (err) => {
                                if (err) throw new Error(err, console.log("[FAILURE] Couldn't create the bots JSON file, please create manually"))
                            })
                        } else {
                            console.log('[SKIPPING] The File Already Exists.')
                        }
                    })

                    self.instances[id].client.on('loggedOn', () => {
                        console.log(`Bot ${id} has successfully logged in.`);

                    });
                    // authenticated
                    // console.log(`Bot (${id}) has been logged-iin.`)

                }, () => {
                    console.log('[!] All bots online.');
                    if (typeof done === 'function') {
                        done(null); // no error
                    }
                });
        } else {
                const errorMessage = "Steam or Steam purchase is down";
            console.log(errorMessage);
            if (typeof done === 'function') {
                done(errorMessage); // pass error to callback
            }
        }
}


Trade.prototype.addBotListeners = function addBotListeners() {
    console.log("jipii");
   /* this.botListen('manager', 'newOffer', (offer) => {
        setTimeout(() => offer.decline(), 1)
    })*/
}


Trade.prototype.writeLogs = function writeLogs(type, msg) {
    const logFolder = './polls/';
    if (!fs.existsSync(logFolder)) {
        fs.mkdirSync(logFolder);
    }

    const currentDate = new Date();
    let logFileName = '';

    if (type === "bot") {
        logFileName = `BotEvents.json`;
    } else if (type === "offer") {
        logFileName = `OfferEvents.json`;
        
    } else {
        // Invalid type
        console.log(`Invalid log type: ${type}`);
        return;
    }

    const logFilePath = `${logFolder}/${logFileName}`;

    const event = {
        type: type,
        timestamp: currentDate.toString(),
        message: msg,
        
    };

    let logData = {};

    // Check if the log file exists
    if (fs.existsSync(logFilePath)) {
        const logFileContent = fs.readFileSync(logFilePath, 'utf-8');
        logData = JSON.parse(logFileContent);
    }

    const currentDateISO = currentDate.toISOString();

    // Add the event to the log data if it doesn't already exist
    if (!logData[currentDateISO] || !logData[currentDateISO].some(log => log.message === msg)) {
        if (!logData[currentDateISO]) {
            logData[currentDateISO] = [];
        }
        logData[currentDateISO].push(event);

        // Write the updated log data to the file
        fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2));

        console.log('Event logged in the JSON file.');
    }
}



Trade.prototype.reloadBotSessions = function reloadBotSessions() {
    return new Promise((resolve, reject) => {
        let msg = "";

        this.getSteamStatus()
            .then((steamStatus) => {
                // Bot reload logic based on Steam status
                if (steamStatus !== "critical") {
                    // Bot reload logic when Steam status is not critical
                    const self = this;
                    Object.keys(self.instances).forEach((id) => {
                        self.instances[id].client.webLogOn();
                        self.instances[id].client.setPersona(SteamUser.EPersonaState.Online);
                        self.instances[id].client.gamesPlayed([config.appID]);
                    });
                    msg = "Bot reloaded successfully. Steam Status: "+steamStatus;
                    resolve(null);
                } else {
                    // Bot reload failed due to critical Steam status
                    msg = "Bot reload failed because Steam or something else. Steam Status: "+steamStatus;
                    const self = this;
                    Object.keys(self.instances).forEach((id) => {
                        self.instances[id].client.setPersona(SteamUser.EPersonaState.Offline);
                    });
                    reject();
                }
                
                this.writeLogs("bot",msg);
                
        })
            
            .catch((error) => {
                const errorMessage = "Error reloading bot instances";
                reject(errorMessage);
            });
       
    });
}

Trade.prototype.getSteamStatus = function getSteamStatus() {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?key=${config.steamApiKey}`)
            .then((response) => {
                const invStatus = response.data.result.services.SteamCommunity;
               
                if (invStatus !=="critical") {
                   
                    resolve(invStatus);
                } else {
                    const errorMessage = "Steam or Steam purchase is down";
                    reject(invStatus);
                }
            })
            .catch((error) => {
                const errorMessage = "Error reloading bot instances";
                reject(errorMessage);
            });
    });
}


Trade.prototype.getBot = function getBot(id) {
    return this.instances[id]
}

Trade.prototype.botConfirmation = function botConfirmation(id) {
    const bot = this.instances[id]
    console.log("botConfBot: " + bot);
   // bot.community.acceptConfirmationForObject(bot.user.identitySecret, offerid, callback)
}

Trade.prototype.checkOffer = function checkOffer(bot) {
    const acceptOffer = (offer) => {
        offer.accept((err) => {
            bot.community.checkConfirmations();
            const msg="Accepting offer from: "+offer.partner.getSteamID64();
            this.writeLogs("offer",msg);
        });
    };

    const declineOffer = (offer) => {
        offer.decline((err) => {
            const msg="Declining offer from: "+offer.partner.getSteamID64();
            this.writeLogs("offer",msg);
        });
    };
    
    bot.manager.on('newOffer', async (offer) => {
        if (offer.itemsToGive.length === 0) {
            
                const offerObj = {
                    items: offer.itemsToReceive,
                    authorizer: offer.partner.getSteamID64(),
                };
                try {
                    const dbOffer = await confirmOffer(offerObj);
                    console.log("dbOff: " + dbOffer);
                    if (dbOffer === true) {
                        acceptOffer(offer);
                        console.log("acc");
                    } else {
                        declineOffer(offer);
                        console.log("dec");
                    }
                } catch (err) {
                    console.error(err);
                    declineOffer(offer);
                }
            
        } else {
            declineOffer(offer);
        }
    });

}

Trade.prototype.checkUserStatus = function checkUserStatus(id,tradeUrlToken,steamId,callback) {


    const offer = id.manager.createOffer(steamId, tradeUrlToken);

    offer.getUserDetails(function (err, me, them) {

        if (err) {
            console.log(err);
            callback(false);
            return;
        }

        if (them.escrowDays != 0) {
            //jos ei oo 0 = tradehold
            callback('tradehold');
            return;

        } else if (them.escrowDays===0) {
            callback(true);
            return;

        }
    });

}




Trade.prototype.botListen = function botListen(obj, listen, fn) {
    const self = this
    Object.keys(self.instances).forEach((id) => {
        self.instances[id][obj].on(listen, fn)
    })
}

