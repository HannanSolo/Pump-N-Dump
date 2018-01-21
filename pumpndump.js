const binance = require('node-binance-api');


function init(apiKey, apiSecret){
    //initiate all starting info

    //setup api secret and key for storage
    binance.options({
        'APIKEY':apiKey,
        'APISECRET':apiSecret,
    });
}

function getBalance(callback){
    var userBalance = {};
    binance.balance(function(error, balances){
        //if no error
        if (!error) {
                //loop through each coin
                for(var coin in balances) {
                    //if balance is not empty
                    if(balances[coin].available > 0.00000000) {
                        userBalance[coin] = balances[coin];//push to userBalance
                    }
                }
                callback(userBalance);//pass balance into callback
        }
        //on error
        else{
            console.log(error);
            return
        }
    });
}

function getPrices(callback) {
    //calls binance for list of all possible convertions
    binance.prices(function(error, ticker) {
        if(!error) {
             callback(ticker);
        } else {
            console.log("getPrices: error getting prices");
        }
    });
}

//returns a day graph 
function dayGraph(callback, symbol) {

    binance.candlesticks(symbol + 'BTC', "12h", (error, ticks, symbol) => {
        callback(ticks);
        //get 7 days of data.
    }, {limit: 14});
}



//cleans out data of the day graph and returns the data points.
function graphData(callback, symbol) {
    data = [];
    dayGraph(function(ticks) {
        var closes = [];
        for(var i = 0; i < ticks.length; i++) {
            closes.push(ticks[i][4]);
        }
        data = closes;
        callback(data);
    }, symbol);
} 

//Buy the respected amount of coins on portfolio
function pumpOrder(symbol, percent, pumpAmount) {
    var tempBalance;
    //get users balance of all coins
    getBalance(function(userBalance){
        tempBalance = userBalance;
        var btcToTokenConversion;
        //gets current prices for all coins and get the ones that need to be pumped 
        getPrices(function(ticker) {

            btcToTokenConversion = parseFloat(ticker[symbol + 'BTC']);
            //sets amount to buy of each coin
            var quantity = pumpAmount * percent / btcToTokenConversion;
            //check if you have enough money, and percentage is in the right range, and minimal requirement is met.
            if(tempBalance.BTC.available <= pumpAmount * percent || percent > 1 || percent < 0 || quantity * btcToTokenConversion < .0003) {
                console.log("pumpOrder: something went wrong, didnt have enough funds");
                return;
            };
            console.log("worked!");
            console.log(parseFloat(quantity.toFixed(4)));
            if(btcToTokenConversion < .001) quantity = Math.floor(quantity);
            else if(btcToTokenConversion < .01) quantity = parseFloat(quantity.toFixed(1));
            else if(btcToTokenConversion < .1) quantity = parseFloat(quantity.toFixed(2));
            else quantity = parseFloat(quantity.toFixed(3));
            //send buy command to binance &
            binance.marketBuy(symbol + "BTC",parseFloat(quantity.toFixed(3)));
        });
    });
}

function dumpOrder(symbol, percent) {

    var tempBalance;

    getBalance(function(userBalance){
        tempBalance = userBalance;
        getPrices(function(ticker) {

            btcToTokenConversion = parseFloat(ticker[symbol + 'BTC']);
            var quantity = tempBalance[symbol].available * percent;
            //check if you have enough money to sell
            if(tempBalance[symbol] <= 0 || percent > 1 || quantity * btcToTokenConversion < .0003) {
                console.log("dumpOrder: didnt have enough coins");
                return;
            }
            if(btcToTokenConversion < .001) quantity = Math.floor(quantity);
            else if(btcToTokenConversion < .01) quantity = parseFloat(quantity.toFixed(1));
            else if(btcToTokenConversion < .1) quantity = parseFloat(quantity.toFixed(2));
            else quantity = parseFloat(quantity.toFixed(3));
            //send sell order to binance
            binance.marketSell(symbol + "BTC", quantity);
        });
    });
}

function getNewCoins(callback) {
    //use by passing in a callback that takes in a single parameter (array)
    //eg, allCoins(function(coins) {console.log(coins)} )
    var userBalance = [];
    binance.balance(function(error, balances){
        if (!error) {
                for(var coin in balances) {
                    if(balances[coin].available == 0.00000000) {
                        userBalance.push(coin);
                    }
                }
                callback(userBalance);
        }
        else{
            console.log(error);
            return;
        }
    });
}

module.exports.init = init;
module.exports.getBalance = getBalance;
module.exports.getPrices = getPrices;
module.exports.dumpOrder = dumpOrder;
module.exports.pumpOrder = pumpOrder;
module.exports.graphData = graphData;
module.exports.dayGraph = dayGraph;
module.exports.getNewCoins = getNewCoins;
