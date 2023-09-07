const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');
const LRU = require('lru-cache')
const TradeBot = require('./lib/trade')
const config = require('./config')
const { createTrade, updateInvCall, getUserTrades } = require('./servers/dbServer');

const io = new Server(5000, { perMessageDeflate: false, cors: { credentials: true, origin: ["http://localhost:3000"] }, allowedHeaders: ["jwt"], });

let Trade;


try {
    Trade = new TradeBot({
        io,
        onBotReloadError: (error) => {
            io.emit("errorChannel", { code: 408 });
        },
        onBotReloadSuccess: (message) => {
           
            io.emit("errorChannel", { code:200});
        }
    });
    console.log("TradeBot started successfully.");
} catch (error) {
    io.emit("errorChannel", { code: 408 });
    console.error("Error starting TradeBot:", error);
}


const options = {
    // maximum number of items to keep in cache
    max: 500,

    // how long to live in ms
    ttl: 6 * 60 * 60 * 1000, // 6 hours
};
const cache = new LRU(options);



io.on('connection', (socket) => {

    socket.on("steamStatus", () => {
        Trade.getSteamStatus()
            .then((status) => {
                const modifiedStatus = status.charAt(0).toUpperCase() + status.slice(1);
                socket.emit("steamRespStatus", { steamStatus:modifiedStatus });
            })
            .catch((error) => {
                const modifiedErrStatus = error.charAt(0).toUpperCase() + error.slice(1);
                socket.emit("steamRespStatus", { steamStatus:modifiedErrStatus});
            });
    });

  

    socket.on("auth", (userID) => {
        const cookieHeader = socket.handshake.headers.cookie;
        if (cookieHeader) {
            const cookie = cookieHeader.split(';').find((cookie) => cookie.trim().startsWith('jwt='));
            if (cookie) {
                const token = cookie.split('=')[1];
                try {
                    const decoded = jwt.verify(token, process.env.JWTS);
                    const tokenUserId = decoded.id;
                    // Store the user ID in the socket object for future use

                    if (userID === tokenUserId) {
                        socket.userId = tokenUserId;
                        console.log(`User ${tokenUserId} connected.`);

                    } else {

                        socket.emit("errorChannel", { code: 407 });

                        console.error('Error verifying JWT:', err.message);
                        socket.disconnect();
                    }

                } catch (err) {
                    socket.emit("errorChannel", { code: 407 });
                    console.error('Error verifying JWT:', err.message);



                    socket.disconnect();
                }
            }

        } else {
            socket.disconnect();
        }
    });



    //socket.emit('site', config.site)
    // socket.emit('user', userObject)


    socket.on("sendTradeInf", async (steamId, tradeToken, itemsArray) => {

        if (!socket.userId) {
            socket.emit("errorChannel", { error: 407 });
            return;
        }



        //const itemsId = itemsArray.map(skin => skin.id);

        let steamStatus;
        try {
            await Trade.getSteamStatus();
            steamStatus = true;
        } catch (error) {
            steamStatus = false;
            socket.emit('errorChannel', { code: 408 });
            return;
        }
        if (steamStatus) {
            console.log("tradeInfGet");
            
            if (steamId != null && itemsArray.length > 0 && tradeToken != null) {
               
              /*  const newItem=
                {
                    id: '29705141805',
                    name: 'Aug | Snake Pit (Minimal Wear)',
                    tradeLock: false
                  };
                  itemsArray.push(newItem);
*/
                const getUserInv= await Trade.getInventoryNames(steamId);
                const checkUserInv = Object.values(getUserInv);
                const commonItems = checkUserInv.filter(item => itemsArray.some(x => x.marketHashName === item.name));

                if (commonItems.length !== itemsArray.length) {
                    socket.emit("respInf",{status:404});
                    return;
                } 

                const botLen = Object.keys(config.bots).length;
                let randomBot = Math.floor(Math.random() * botLen);

                const selectBot = Object.keys(config.bots)[randomBot];
                const useBot = Trade.getBot(selectBot);


                //checks if user has authenticator

                Trade.checkUserStatus(useBot, tradeToken, steamId,async(result) => {

                    if (!result) {
                        socket.emit("respInf", { status: 402 });
                        return;
                    } else if (result === "tradehold") {
                       
                        socket.emit("respInf", { status: 401 });
                        return;

                    } else if (result) {
                        
                        //gets trade info
                        const filterItemsArr = itemsArray.map(item => {
                            return {
                                appId: item.appId,
                                assetId: item.assetId,
                                float: item.float,
                                image: item.image,
                                marketHashName: item.marketHashName,
                                tradelock: item.tradelock,
                                value: item.value,
                            }
                        })
                        const userAddress = socket.handshake.address;

                        const tradeTotalPrice = filterItemsArr.map(p => p.value);
                        const sumTotalPrice = tradeTotalPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0);



                        const infObject = {
                            id64: steamId,
                            userAdd: userAddress,
                            tradeItems: filterItemsArr,
                            tradeTotalSum: sumTotalPrice,

                        }

                        //db
                        createTrade(infObject, (dbResult) => {
                          console.log(dbResult);
                          
                            if (!dbResult) {
                                socket.emit("respInf", { status: 403 });
                            } else {
                                const logMsg="Offer created by: "+steamId+" with database id: "+dbResult;
                                Trade.writeLogs("offer",logMsg);

                                socket.emit("respInf", { status: true });
                                //pit�isi l�hett�� info fronttii et voi avata trustlyn
                                Trade.checkOffer(useBot);
                            }

                        })


                    }
                });



            }

            else {
                socket.emit("respInf", { data: "values null" });
            }
        }
    });




    socket.on('get user inv', async (steamID64) => {



        let steamStatus;
        try {
            await Trade.getSteamStatus();
            steamStatus = true;
        } catch (error) {
            steamStatus = false;
            socket.emit('errorChannel', { code: 408 });
            return;
        }

        if (!socket.userId) {
            socket.emit("errorChannel", { code: 407 });
            return;
        }

        if (steamStatus) {

            const cacheKey = 'steamInventory:' + steamID64;
            const cacheData = cache.get(cacheKey);

            if (cacheData) {
                socket.emit('user inv', { items: cacheData });

            } else {

                try {

                    const inventoryData = await Trade.getInventory(steamID64);
                    if (inventoryData === {}) {

                        socket.emit('user inv', { error: "Kokeile uudestaan ja varmista ett� invisi on julkinen", items: null });
                    } else {

                        const botInv = await Trade.getInventoryNames(config.bots.bot_1.steamID64);
                        const botItemCount = {};

                        Object.values(botInv).forEach(item => {

                            botItemCount[item.name] = (botItemCount[item.name] || 0) + 1;

                        });

                        let updatedUserInv = Object.values(inventoryData).map(item => {
                            if (item && item.marketHashName && botItemCount[item.marketHashName] >= 5) {
                                item.error = "Liian monta ostettu";
                                return item;
                            } else {
                                return item;
                            }

                        });
                        // Save the inventory data to the cache
                        cache.set(cacheKey, updatedUserInv);
                        socket.emit('user inv', { error: null, items: updatedUserInv });
                    }
                } catch (error) {
                    console.log(error);
                    socket.emit("user inv", { error: "Kokeile my�hemmin uudelleen", items: null });
                }





            }

        }


    });



    socket.on("force refresh userInv", async (steamID64) => {
        if (!socket.userId) {
            socket.emit("errorChannel", { code: 407 });
            return;
        }
        let steamStatus;
        try {
            await Trade.getSteamStatus();
            steamStatus = true;
        } catch (error) {
            steamStatus = false;
            socket.emit('errorChannel', { code: 408 });
            return;
        }
        if (steamStatus) {
            try {
              

                const userInv = await Trade.getInventory(steamID64);
                if (userInv === {}) {
                    socket.emit('user inv', { error: "Kokeile uudestaan ja varmista ett� invisi on julkinen", items: null });
                } else {
                    const botInv = await Trade.getInventoryNames(config.bots.bot_1.steamID64);
                    const botItemCount = {};
                    Object.values(botInv).forEach(item => {
                        botItemCount[item.name] = (botItemCount[item.name] || 0) + 1;
                    });

                    let updatedUserInv = Object.values(userInv).map(item => {
                        if (item && item.marketHashName && botItemCount[item.marketHashName] >= 5) {
                            item.error = "Liian monta ostettu";
                            return item;
                        } else {
                            return item;
                        }
                    });

                    // Save the inventory data to the cache
                    const cacheKey = 'steamInventory:' + steamID64;
                    cache.set(cacheKey, updatedUserInv);

                    socket.emit('user inv', { error: null, items: updatedUserInv });
                }
            } catch (err) {
                socket.emit('user inv', { error: err, items: null });
            }
        }

    });

    socket.on("get user offers", (steamID64) => {
        if (!socket.userId) {
            socket.emit("errorChannel", { code: 407 });
            return;
        }

        if (socket.userId === steamID64) {

            if (steamID64 != null) {
                //checks database with id

                getUserTrades(steamID64, (offer) => {
                    socket.emit("User offers received", { offers: offer });

                });

            } else {
                socket.emit("errorChannel", { code: 407 });
                return;
            }
        } else {
            socket.emit("errorChannel", { code: 407 });
            return;
        }




    });



});