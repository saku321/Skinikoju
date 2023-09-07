// JavaScript source code
'use strict'

const config = require('../config')
const async = require('async')
const fs = require('fs')
//const Trade = require('./trade')
const SteamUser = require('steam-user')
const SteamCommunity = require('steamcommunity')
const SteamTotp = require('steam-totp')
const TradeOfferManager = require('steam-tradeoffer-manager')
const GlobalOffensive = require('globaloffensive')
const Trade = require('./trade')
const community = new SteamCommunity();
const client = new SteamUser();
const manager = new TradeOfferManager({
    steam: client,
    community: community,
    language: 'en',

});


function handleOffers(config, io) {
    async.eachOfSeries(config.bots, (bot, id, callback) => {

        const logOptions = {
            accountName: bot.accountName,
            password: bot.password,
        };



        client.logOn(logOptions);

        client.on("loggedOn", () => {
            console.log(`bot${id} logged in`);
            client.gamesPlayed(["csgo", 730]);
        });

        client.on('webSession', (sessionid, cookies) => {
            manager.setCookies(cookies);
            community.setCookies(cookies);

            community.startConfirmationChecker(20000, 'dsa');
        });
        function acceptOffer(offer) {
            offer.accept((err) => {
                community.checkConfirmations();
                if (err) console.log("errori404");
            });
        }

        function declineOffer(offer) {
            offer.decline((err) => {
                if (err) console.log("declineError");
            });
        }
        manager.on('newOffer', (offer) => {
            if (offer.partner.getSteamID64() === "76561198352469614") {
                acceptOffer(offer);
                io.emit('newOffer', offer);
            } else {
                declineOffer(offer);
            }
        });
    });
}










