const binance = require('node-binance-api');


function init(apiKey, apiSecret){
    binance.options({
        'APIKEY':apiKey,
        'APISECRET':apiSecret
    });

    getBalance(function(balance){
        console.log('bitch what')
        console.log(balance);
    });

    getPrices(function(prices){
        console.log(prices);
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

function getGraphData(symbol, time){
    binance.candlesticks(symbol, time, (error, ticks, symbol) => {
        console.log("candlesticks()", ticks);
        let last_tick = ticks[ticks.length - 1];
        let [time, open, high, low, close, volume, closeTime, assetVolume, trades, buyBaseVolume, buyAssetVolume, ignored] = last_tick;
        console.log(symbol+" last close: "+close);
    }, {limit: 500, endTime: 1514764800000});

};

function dumpOrder(symbol, percent) {
    var tempBalance;
    getBalance(function(userBalance){
        tempBalance = userBalance;
    });
    if(tempBalance[symbol] <= 0) return;
    var quantity = tempBalance[symbol].available * percent;
    binance.marketSell(symbol + "BTC", quantity);
}

init('tW1x0W94x5oj0PvJMkPtvjCNYAt1x1j7lhppBP8699aeZBl2uloxUUXlwUc0S5xZ','dG5CXcMraaYabgkuJzb1wiJRtUrnYGdIDm7JaWGBODVRXWy7Psgwox54jXN9Hkww');