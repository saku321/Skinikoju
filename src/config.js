'use strict'
require('dotenv').config();
module.exports = {
    appID: 730, // 730 - CS:GO
    contextID: 2, // ContextID
    bots: {
        bot_1: {
            siteName: 'Bot 1',  // Will be displayed under the "All bots" tab e.g. "Keys Only"
            accountName: process.env.FIRSTINPUT,    // bot_1 username
            accountPas: process.env.SECONDINPUT,       // bot_1  password
            twoFactorCode: process.env.TWOFACT,  // shared_secret value //botska33:+YfqBJl8vuPacVTnLYNBar8yxS4=
            identitySecret: '', // identity_secret value
            steamID64: process.env.BOTID64,  // SteamID64 of bot account can be found here: "https://steamid.io/"
            personaName: '||',   // Nickname for bot account, will change on restart
            number:0,
        },
    },
    steamApiKey: process.env.STEAM_API,    // Your Steam API key, get it here: https://steamcommunity.com/dev/apikey
    sessionSK: process.env.SESSIONSK,
    PricempireApiKey: process.env.PRICEMPIRE_API, // ja enviin
    DBHost:process.env.HOST,
    DBUser:process.env.DUSER,
    DBPass:process.env.DBPASS,
    DBName:process.env.DB,
    websitePort: 80,    // Website PORT, don't change it unless you're using a reverse proxy
    rates: {
        buyRate: process.env.BUYRATE,
        lowestPrice: process.env.LOWEST,//ineuros
        priceEro: process.env.PRICERO,
        WAvgEro:process.env.WAVGERO,
    },
    errors: {
        lowPrice: 'Liian alhainen hinta',

    }
}
