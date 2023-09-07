'use strict'
const axios = require("axios");
const config = require('../config')
const Trade = require('./trade')

const API = 'https://pricempire.com/api/v2'
const itemPrices = `${API}/getAllItems?api_key=954b48bd-1108-4f2c-8b31-61a55fa97c72&urrency=USD&source=buff163,csgoempire,buff163_quick`
const priceEmpireApi = 'https://pricempire.com/api/v2/getAllItems?api_key=' + config.PricempireApiKey + '&currency=EUR&';
Trade.prototype.getPrices = function getPrices(callback) {
   
        /*
        let Tprice;
         axios.get(priceEmpireApi + "maxAge=7&inflationThreshold=24&minCount=1&source=buff_avg30,buff_buy_avg30").then((res) => {
            const buffAvgData = res.data[itemName].buff163_avg30;
            const buffBuyAvg30 = res.data[itemName].buff163_quick_avg30;

            //error checks

            // Check if buffAvgData is undefined
            if (buffAvgData === undefined) {
                console.log("SKini jää filtteriin eikä sitä osteta");
                inventory[asset.assetid].data.errorMessage = 'Item not found on price database';

            }

            // Check if buffAvgData has valid price data
            if (!buffAvgData) {
                console.log("itemiä ei valita koska hintaa ei löydy");

            }

            // Check if buy order data has valid price data
            if (!buffBuyAvg30 || buffBuyAvg30 === 0) {
                console.log("itemiä ei valita koska buyorder hintaa ei löydy");

            }


            // Calculate price and total price

            const price = (buffAvgData + buffBuyAvg30) / 2;

            // Check if priceEro is within range
            const priceEro = buffAvgData / buffBuyAvg30;

            if (priceEro >= 15) {
                console.log("Liian iso ero buyorderin ja avg hinnan välillä = ei osteta");

            }
            Tprice = price;


        }).catch((err) => {
            console.log(err);
        });*/
     
  
}
