'use strict'

const config = require('../config')
const async = require('async')

function Trade(params) {
    this.prices = {};
    this.floats = {};
    this.instances = [];
    this.io = params.io || false;

    this.getPrices((prices) => {
        this.prices = prices;
    });


    // Define the default onBotReloadError function
    const defaultOnBotReloadError = (error) => {
        console.error("Error reloading bot instances:", error);
    };

    // Use the custom onBotReloadError function if provided, otherwise use the default function
    const onBotReloadError = params.onBotReloadError || defaultOnBotReloadError;




    setInterval(() => {
        this.reloadBotSessions()
            .then(() => {
                console.log("Bot instances reloaded successfully.");
                if (typeof params.onBotReloadSuccess === 'function') {
                    params.onBotReloadSuccess();
                }
            })
            .catch((error) => {
                
                onBotReloadError(error);
            });
    }, 2000000); //20min




    try {
        this.startBots(() => {
            this.addBotListeners();
           
        });
    } catch (error) {
        console.error("Error starting TradeBot:", error);
        if (typeof params.onTradeBotError === 'function') {
            params.onTradeBotError(error);
        }
    }
}


Trade.prototype.getSteamStatus = function () {
    return this.getSteamStatus();
};



Trade.prototype.getPriceList = function getPriceList() {
    return new Promise((resolve, reject) => {
        this.getPrices((prices) => {
            resolve(prices);
        });
    });
}

Trade.prototype.getFloatValues = function getFloatValues() {
    return this.floats
}



Trade.prototype.getPrice = function getPrice(name) {
   
}

Trade.prototype.getUserRates = function getUserRates() {
    return config.rates.user
}

Trade.prototype.getBotRates = function getBotRates() {
    return config.rates.bot
}

Trade.prototype.getTrashPrice = function getTrashPrice() {
    return config.rates.trashPriceBelow
}

Trade.prototype.getIgnorePrice = function getIgnorePrice() {
    return config.rates.ignoreItemsBelow
}



module.exports = Trade

require('./bots')
require('./inv')
require('./price')