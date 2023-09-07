const mysql = require('mysql');
const axios = require("axios");
const config = require("../config");
const connection = mysql.createConnection({
    host: config.DBHost,
    user: config.DBUser,
    password: config.DBPass,
    database: config.DBName,
});


const createUser = (userInfoObject) => {

    const createTableQuery = `CREATE TABLE IF NOT EXISTS UsersTable (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId VARCHAR(255) NOT NULL,
        user_IP_Add VARCHAR(255),

        userTradeUrl VARCHAR(255) NOT NULL,
        invLastCall TIMESTAMP
        
    );`;


    connection.query(createTableQuery, (err, res, fields) => {
        if (err) {
            return;
        } 
        const checkQuery = 'SELECT * FROM UsersTable WHERE userId = ?';
        connection.query(checkQuery, [userInfoObject.id], (err, results) => {
            if (err) return;
          
            if (results.length > 0) {


                return;
            }
          
            const setDataQuery = 'INSERT INTO UsersTable (userId, user_IP_Add,invLastCall) VALUES (?, ?,DATE_FORMAT(NOW(), "%Y-%m-%d %H:%i:%s"))';

            connection.query(setDataQuery, [userInfoObject.id, userInfoObject.ip], (err, results) => {
                if (err) return;
                console.log("done: ");
            });
        });
        
    });
}

const createTrade = (tradeObject,callback) =>{

    const createTradeQuery = `CREATE TABLE IF NOT EXISTS Trades(
         tradeId INT(6) ZEROFILL PRIMARY KEY AUTO_INCREMENT,
         tradeTime TIMESTAMP NOT NULL,
         tradeStatus INT NOT NULL,
         
         items JSON NOT NULL,
         tradePrice FLOAT NOT NULL,
         tradeAuthorizer VARCHAR(255) NOT NULL,
         authorizerIp VARCHAR(255) NOT NULL,
         INDEX (tradeTime)

    )`;


    connection.query(createTradeQuery, (err, res) => {
        if (err) console.log(err);

        const tradePrice = tradeObject.tradeTotalSum;
        const userId = tradeObject.id64;
        const userAddress = tradeObject.userAdd;
        const tradeItems = JSON.stringify(tradeObject.tradeItems);

        const checkTradeExist = "SELECT * FROM Trades WHERE tradeAuthorizer=? AND items=?";
        
        connection.query(checkTradeExist, [userId, tradeItems],(err, res) => {
            if (err) console.log(err);
            
            if (res.length > 0) {
                console.log(res.length);
                callback(false);
                return;
            } else {

              

                const insertTrade = 'INSERT INTO Trades (tradeTime,TradeStatus,items,tradePrice,tradeAuthorizer,authorizerIp) VALUES (DATE_FORMAT(NOW(), "%Y-%m-%d %H:%i:%s"),?,?,?,?,?)';

                connection.query(insertTrade, [0,tradeItems,tradePrice,userId,userAddress], (err, result) => {
                    if (err) {
                        console.log(err);
                        callback(false);
                    }else{
                        const tradeId = String(result.insertId).padStart(6, '0'); // Format tradeId with leading zeros
                        callback(tradeId);

                    }
                    
                });

            }

        })
         


    });



}


const updateUrl = (steam64,url,callback) => {
 
        const checkQuery = 'SELECT * FROM UsersTable WHERE userId = ?';
        connection.query(checkQuery, [steam64], (err, results) => {
            if (err) {
                callback(false);
                return;
            }
            if (results.length > 0) {
                const updateQuery = 'UPDATE usersTable SET userTradeUrl =? WHERE userId=?';

                connection.query(updateQuery, [url, steam64], (err, results) => {
                    if (err) {
                        callback(false, err);
                        return;
                    }
                    console.log("updated url ");
                    callback(true);
                });
            } else {
                callback(false);
                return;
            }

            

    });
}
const getTradeUrl = (steam64, callback) => {

    const getQuery = 'SELECT userTradeUrl FROM UsersTable WHERE userId = ?';
    connection.query(getQuery, [steam64], (err, results) => {
        if (err) return;

        if (results.length > 0) {
            callback(results);
        } else {
            callback(false);

            return;
        }



    });
}



const updateInvCall = (steam64)=>{
    const updateQuery = 'UPDATE usersTable SET invLastCall=DATE_FORMAT(NOW(), "%Y-%m-%d %H:%i:%s") WHERE userId=?';
    connection.query(updateQuery, [steam64], (err, result) => {
        if (err) return;
        if (result) {
            console.log("updated inv");
        }

    });
}

const getInvCall = (steam64,callback) => {

    const getQuery = "SELECT invLastCall FROM usersTable WHERE userId=?";
    connection.query(getQuery, [steam64], (err, result) => {
        if (err) return;
        if (result.length > 0) {
            callback(result);
        } else {
            callback(false);
            return;
        }


    });
}


const confirmOffer = (offerObject) => {
    return new Promise((resolve, reject) => {
        const checkOfQuery = "SELECT * FROM Trades WHERE tradeAuthorizer=? AND JSON_EXTRACT(items, '$[*].assetId') = ? AND JSON_EXTRACT(items, '$[*].appId') = ?  AND JSON_EXTRACT(items, '$[*].marketHashName') = ?";
        connection.query(checkOfQuery, [
            offerObject.authorizer,
            JSON.stringify(offerObject.items.map(item => item.assetid)),
            JSON.stringify(offerObject.items.map(item => item.appid)),
            JSON.stringify(offerObject.items.map(item => item.market_hash_name))
        ], (err, result) => {
            if (err) {
                reject(err);
            } else if (result.length === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};


const getCollectionAge = async () => {
    const getAgeQuery = "SELECT collectionName FROM Collection";
    return new Promise((resolve, reject) => {
        connection.query(getAgeQuery, (err, result) => {
            console.log(result);
            if (err) {
                reject(err);
            } else if (result.length > 0) {
                resolve(result[0].collectionName);
            } else {
                resolve(null);
            }
        });
    });
}
const checkLastWeekPrice = (itemName, itemPrice, callback) => {
    const checkQuery = "SELECT lastPrice FROM LastWeekPrices WHERE itemName = ? AND saveTime <= DATE_ADD(NOW(), INTERVAL -7 DAY)";

    connection.query(checkQuery, [itemName], (err, result) => {
        if (err) {
            console.log(err);
            callback(false);
        } else if (result.length > 0) {
            // If there's an existing row with saveTime at least 7 days ago, update the lastPrice
            const updateItem = "UPDATE LastWeekPrices SET lastPrice = ? WHERE itemName = ? AND saveTime <= DATE_ADD(NOW(), INTERVAL -7 DAY)";
            connection.query(updateItem, [itemPrice, itemName], (err, status) => {
                if (err) {
                    console.log(err);
                    callback(false);
                } else {
                    console.log("edell " + result[0].lastPrice);
                    callback(result[0]);
                }
            });
        } else {
            // If there's no existing row, check if there's a row with itemName and saveTime less than 7 days ago
            const checkExistingQuery = "SELECT lastPrice FROM LastWeekPrices WHERE itemName = ? AND saveTime > DATE_ADD(NOW(), INTERVAL -7 DAY)";
            connection.query(checkExistingQuery, [itemName], (err, existingResult) => {
                if (err) {
                    callback(false);
                } else if (existingResult.length > 0) {
                    // If there's an existing row with saveTime less than 7 days ago, return the existing row data
                    callback(existingResult[0]);
                } 
            });
        }
    });
}
const getBlackList = (skinName, callback) => {
    const checkQuery = "SELECT itemName FROM BlackListedSkins WHERE itemName LIKE ?";

    connection.query(checkQuery, [`%${skinName}%`], (err, result) => {
        if (err) {
            callback(false);
        }
        if (result.length > 0) {
            callback(true);
        } else {
            callback(false);
        }
    });
}

const getUserTrades = (steamID64, callback) => {
    const getQuery = "SELECT tradeTime,items,tradePrice,tradeStatus FROM Trades WHERE tradeAuthorizer=? AND TIMESTAMPDIFF(HOUR, tradeTime, NOW()) < 12;";

    connection.query(getQuery, [steamID64], (err, result) => {
        if (err) {
            callback(false);
        }
        if (result.length > 0) {
            if (result[0].tradeStatus < 3) {
                callback(result[0]);
            } else {
                callback(false);
            }

         
        } else {
            callback(false);
        }

    });
}

/*
const insertPrices=async() => {
    try {
        const resp = await axios.get("https://pricempire.com/api/v2/getAllItems?api_key=954b48bd-1108-4f2c-8b31-61a55fa97c72&maxAge=60&minCount=1&Currency=EUR&source=buff_avg7");

        for (const [item_name, prices] of Object.entries(resp.data)) {
            const buff163_avg7 = prices.buff163_avg7;
            console.log(item_name);
            console.log(buff163_avg7);
            if (buff163_avg7) {
                // Insert item name and buff163_avg7 price into database
                const sql = "INSERT INTO LastWeekPrices (itemName, lastPrice) VALUES (?, ?)";
                connection.query(sql, [item_name, buff163_avg7], (error, results, fields) => {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        }

    } catch (error) {
        console.error(error);
    }
}
*/

module.exports = {
    createUser,
    updateUrl,
    getTradeUrl,
    updateInvCall,
    getInvCall,
    getCollectionAge,

    createTrade,
    confirmOffer,
    checkLastWeekPrice,
    getBlackList,
    getUserTrades,

};