const mysql = require('mysql');
const axios = require("axios");
const config = require("./config");
console.log(config.DBHost);
const connection = mysql.createConnection({
    host: config.DBHost,
    user: config.DBUser,
    password: config.DBPass,
    database: config.DBName,
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
  
    console.log('Connected to the database');
    createAllTables();
    // Place your query execution or other database-related code here
  });

const createAllTables=()=>{
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
    });

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
   });


   const createTrustlyQuery = `CREATE TABLE IF NOT EXISTS Transactions(
    id INT(6) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,

    orderID INT(8),

    orderTime TIMESTAMP,
    orderStatus VARCHAR(25) NOT NULL,
    
    
    orderPrice FLOAT NOT NULL,
    orderAuthorizer VARCHAR(30) NOT NULL,
    authorizerIp VARCHAR(45) NOT NULL,
    INDEX (orderTime)

    )`;


    connection.query(createTrustlyQuery, (err, res) => {
        if (err) console.log(err);
    });


    const createLastWeekQuery = `CREATE TABLE IF NOT EXISTS LastWeekPrices (
        itemId INT(6) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
        itemName VARCHAR(255) NOT NULL,
        lastPrice FLOAT NOT NULL
      )`;
      
      connection.query(createLastWeekQuery, (err, res) => {
        if (err) console.log(err);
      });
      
      const createBlackListedQuery = `CREATE TABLE IF NOT EXISTS BlackListedSkins (
        id INT(11) ZEROFILL NOT NULL AUTO_INCREMENT PRIMARY KEY,
        itemName VARCHAR(255) NOT NULL
      )`;
      
      connection.query(createBlackListedQuery, (err, res) => {
        if (err) console.log(err);
      });
      

}
const createUser = (userInfoObject) => {

  
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
        
   
}

const createTrade = (tradeObject,callback) =>{

   

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
 
}
const createTrustlyRow = (trustlyObject) =>{

    return new Promise((resolve, reject) => {
   

      

        const checkTransactionExist = "SELECT * FROM Transactions WHERE orderAuthorizer=? AND (orderID=? OR orderID IS NULL)";
        
        connection.query(checkTransactionExist, [trustlyObject.authorizer],(err, res) => {
            if (err) console.log(err);
            
            if (res.length > 0) {
                //if found
             
                reject(new Error("Failed to create Trustly row"));
                return;
            } else {

              

                const insertDetails = 'INSERT INTO Transactions (orderStatus,orderPrice,orderAuthorizer,authorizerIp) VALUES (?,?,?,?)';

                connection.query(insertDetails, [0,trustlyObject.orderPrice,trustlyObject.authorizer,trustlyObject.authorizerIP], (err, result) => {
                    if (err) {
                        console.log(err);
                        reject(new Error("Failed to create Trustly row"));
                        return;
                    }else{
                        console.log("kaik kunnos");
                        resolve(true); 
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
        const checkOfQuery = "SELECT * FROM Trades WHERE tradeAuthorizer=? AND JSON_EXTRACT(items, '$[*].appId') = ?  AND JSON_EXTRACT(items, '$[*].marketHashName') = ?";
        connection.query(checkOfQuery, [
            offerObject.authorizer,
            
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
const checkLastWeekPrice = (itemName, callback) => {
    const checkQuery = "SELECT lastPrice,saveTime FROM LastWeekPrices WHERE itemName = ? AND saveTime >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
    connection.query(checkQuery, [itemName], (err, result) => {
      if (err) {
        console.log(err);
        callback(false);
      } else if (result.length > 0) {
        callback(result[0]);
      } else {
        callback(false);
      }
    });
  }

  const updateLastWeekPrices = (priceList, callback) => {

    const checkAge = "SELECT * FROM LastWeekPrices WHERE saveTime<=DATE_SUB(NOW(),INTERVAL 7 DAY)";
    connection.query(checkAge,(err,found)=>{
        
        if(err){
            callback(false);
            return;
        }
      
        if(found.length > 0){
            const updateItem = "UPDATE LastWeekPrices SET lastPrice = ?, saveTime = NOW() WHERE itemName = ? AND saveTime <= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            const values = [];
          
            // Iterate over priceList and create an array of values to be updated
            for (const [itemName, item] of Object.entries(priceList)) {
              values.push([item.buff163_avg7, itemName]);
            }
          
            // Recursive function to update each row sequentially
            const updateRow = (index) => {
              if (index >= values.length) {
                // All rows have been updated
                callback(true);
                return;
              }
          
              connection.query(updateItem, values[index], (err, result) => {
                if (err) {
                  console.log(err);
                  callback(false);
                } else {
                  // Update next row
                  updateRow(index + 1);
                }
                if(index===1005){
                console.log(values[index]);

                }
              });
      
        
            };
            // Start updating rows from index 0
            updateRow(0);

        }else{
            callback(false);
        }

    })

   
  };
  
  

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
    createTrustlyRow,
    confirmOffer,
    checkLastWeekPrice,
    getBlackList,
    getUserTrades,
    updateLastWeekPrices,

};