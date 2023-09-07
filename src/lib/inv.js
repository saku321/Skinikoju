'use strict'

const config = require('../config')
const request = require('request')
const async = require('async')
const Trade = require('./trade')
const axios = require("axios")
const { getCollectionAge, checkLastWeekPrice, getBlackList } = require('../servers/dbServer');

const MAX_RETRIES = 3
const INV_API_URL = 'https://pricempire.com/api/v3/getInventory';//'https://api.steamapis.com/steam/inventory'
const steamApiUrl = 'https://api.steampowered.com/ISteamEconomy/GetAssetClassInfo/v1/';
const priceEmpireApi = 'https://pricempire.com/api/v2/getAllItems?api_key=' + config.PricempireApiKey +'&currency=EUR&';

Trade.prototype.getInventoryNames = async function getInventoryNames(steamID64,retries = 0) {
    try {
        const response = await axios.get(`${INV_API_URL}?api_key=${config.PricempireApiKey}&currency=EUR&steamId=${steamID64}`);

        if (response.status !== 200) {
            throw new Error(`Received status ${response.status} from API`);
        }

        const items = response.data.items;

        const inventory = {};
       
        for (const asset of items) {

            if (asset.id === asset.id && asset.marketHashName.indexOf('Souvenir') === -1) {
                if (typeof inventory[asset.assetid] !== 'undefined') {
                    continue;
                }

                if (asset.type !== 'skin') {
                    continue;
                }

                const obj = {
                    id: asset.assetId,
                    name: asset.marketHashName,
                    tradeLock: asset.tradelock
                };

                inventory[asset.assetId] = obj;
            }
        }

        return inventory;
    } catch (error) {
        const statusCode = error.response?.status;
        if (retries < MAX_RETRIES && statusCode !== 403) {
            return Trade.prototype.getInventoryNames(steamID64, retries + 1);
        }
        throw error;
    }
};

Trade.prototype.getInventory = async function getInventory(steamID64, retries = 0) {
    try {
        const response = await axios.get(`${INV_API_URL}?api_key=${config.PricempireApiKey}&currency=EUR&steamId=${steamID64}`);
        //penttiköyri id 76561198158063960
        if (response.status !== 200) {
            throw new Error(`Received status ${response.status} from API`);
        }

        const items = response.data.items;
        
        const inventory = {};
        // price homma
        const price = await Trade.prototype.getPriceL();
        for (const asset of items) {

            if (
                asset.id === asset.id
                /*&& asset.marketHashName.indexOf('Souvenir') === -1
                && asset.type === 'skin'*/
                && typeof inventory[asset.assetid] === 'undefined'
            ) {
                const itemPrice = price[asset.marketHashName];
                const getTotalItemPrice = Trade.prototype.getItemPrice(itemPrice);
                let filteredTotalPrice = parseFloat(getTotalItemPrice.toFixed(2));
                Trade.prototype.checkItemAge(asset.marketHashName, (itemAge) => {
                    if (itemAge) {
                        errorMsg = "Liian uusi skini";
                        filteredTotalPrice = 0;
                    }
                });

                let errorMsg;


                if (itemPrice.buff163_avg7 === undefined) {
                    errorMsg = "Liian vähän myyntiä";
                    filteredTotalPrice = 0;

                }
                else { 
                    const current7Avg = itemPrice.buff163_avg7 / 100;
                    const calculatePriceChange = (lastWeekPrice, currentPrice) => {
                        const priceChange = ((currentPrice - lastWeekPrice) / lastWeekPrice) * 100;
                        const positivePriceChange = Math.abs(priceChange);
                        return positivePriceChange;
                    }
                    checkLastWeekPrice(asset.marketHashName, itemPrice.buff163_avg7, (lPrice) => {
                   
                        if (lPrice.lastPrice) {

                            const lastPrice = lPrice.lastPrice/100;
                            if (calculatePriceChange(lastPrice, current7Avg) > config.rates.WAvgEro) {
                                //jos on noussu/laskenu
                                errorMsg = "Liikaa hinnanmuutosta";
                                filteredTotalPrice = 0;

                            }
                        } 
              


              
              

                if (asset.tradelock) {
                    errorMsg = 'Ei vaihdettavissa';
                    filteredTotalPrice = 0;
                }

                delete asset.prices;
                delete asset.price;
                delete asset.p;
                delete asset.cheapest;
                
                if (getTotalItemPrice === 0) {
                    errorMsg = config.errors.lowPrice;
                    }
                  
                    if (parseFloat(filteredTotalPrice) < parseFloat(config.rates.lowestPrice)) {

                        errorMsg = config.errors.lowPrice;
                        
                    }
                    inventory[asset.assetId] = asset;
                    inventory[asset.assetId].error = errorMsg;
                    inventory[asset.assetId].value = filteredTotalPrice;
                    inventory[asset.assetId].wear = Trade.prototype.getItemWear(asset.marketHashName);
                    
                });
            }
        }
        }
        
        return inventory;
    } catch (error) {
        const statusCode = error.response?.status;
      
        if (retries < MAX_RETRIES && statusCode !== 403) {
            return Trade.prototype.getInventory(steamID64, retries + 1);
        }
    }
};

Trade.prototype.getItemPrice = function getItemPrice(itemData) {

    
    if (!itemData) {
        return 0;
    }
        const buffAvgData = itemData.buff163_avg30;
        const buffBuyAvg30 = itemData.buff163_quick_avg30;
        //error checks

        // Check if buffAvgData is undefined
        if (buffAvgData === undefined) {
            return 0;
        }

        // Check if buffAvgData has valid price data
        if (!buffAvgData) {
            return 0;
        }

        // Check if buy order data has valid price data
        if (!buffBuyAvg30 || buffBuyAvg30 === 0) {
            return 0;
        }


        // Calculate price and total price

        const calcPrice = (buffAvgData + buffBuyAvg30) / 2;
    
       
        // Check if priceEro is within range
        const priceEro = buffAvgData / buffBuyAvg30;
       

    if (priceEro >= config.rates.priceEro) {
        

        return 0;
    } else {
        const price = calcPrice * config.rates.buyRate;
        const totalPrice = price / 100;

        if (totalPrice < config.rates.lowestPrice) {
            return 0;
        } else {
            return totalPrice;

        }

    }


    
}

Trade.prototype.checkItemAge = function checkItemAge(skinName, callback) {
    const index = skinName.indexOf('(');
    const filterName= index >= 0 ? skinName.slice(0, index).trim() : skinName;

    getBlackList(filterName, (isListed) => {
        if (isListed) {
            callback(true); 
        } else {
            callback(false);
        }
    });
}




Trade.prototype.getPriceL = async function getPriceL() {
    try {
        const response = await axios.get(priceEmpireApi + "maxAge=60&inflationThreshold=24&minCount=1&source=buff_avg30,buff_buy_avg30,buff_avg7");



        const Tprice = response.data;
        return Tprice;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

Trade.prototype.getInventories = function getInventories(params, callback) {
    const inventories = {}
    async.each(params, (user, cb) => {
        Trade.prototype.getInventory(user.steamID64, user.appID, user.contextID, (err, data) => {
            inventories[user.id] = {}
            inventories[user.id] = {
                error: err,
                items: (!err) ? Object.keys(data).map(key => data[key]) : null,
            }
            cb()
        })
    }, () => {
        callback(inventories)
    })
}

Trade.prototype.getItemType = function getItemType(marketHashName, type) {
    if (marketHashName.indexOf('Key') !== -1) {
        return { value: 0, name: 'key' }
    }
    if (marketHashName.indexOf('★') !== -1) {
        return { value: 1, name: 'knife' }
    }
    if (
        type.indexOf('Classified') !== -1 ||
        type.indexOf('Contraband') !== -1 ||
        type.indexOf('Covert') !== -1
    ) {
        return { value: 2, name: 'rare_skin' }
    }
    if (
        type.indexOf('Consumer Grade') !== -1 ||
        type.indexOf('Base Grade') !== -1 ||
        type.indexOf('Graffiti') !== -1 ||
        type.indexOf('Sticker') !== -1 ||
        type.indexOf('Industrial Grade') !== -1
    ) {
        return { value: 4, name: 'misc' }
    }
    return { value: 3, name: 'weapon' }
}

Trade.prototype.getItemWear = function getItemWear(marketHashName) {
    if (marketHashName.indexOf('Factory New') !== -1) {
        return 'FN'
    }
    if (marketHashName.indexOf('Minimal Wear') !== -1) {
        return 'MW'
    }
    if (marketHashName.indexOf('Field-Tested') !== -1) {
        return 'FT'
    }
    if (marketHashName.indexOf('Well-Worn') !== -1) {
        return 'WW'
    }
    if (marketHashName.indexOf('Battle-Scarred') !== -1) {
        return 'BS'
    }
    return false
}
Trade.prototype.getInspect = function getInspect (steamID64, assetid, actions) {
    let inspectLink = null;                                           
    if (actions) {
        for (const a in actions) {
            if (actions[a].name.indexOf('Inspect') !== -1) {
                   inspectLink = actions[a].link
                   inspectLink = inspectLink.replace('%owner_steamid%', steamID64)
                   inspectLink = inspectLink.replace('%assetid%', assetid)
            }
        }
    }
    return inspectLink
}
