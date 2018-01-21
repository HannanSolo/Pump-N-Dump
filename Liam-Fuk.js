var test =require('./pumpndump')

test.init('tW1x0W94x5oj0PvJMkPtvjCNYAt1x1j7lhppBP8699aeZBl2uloxUUXlwUc0S5xZ','dG5CXcMraaYabgkuJzb1wiJRtUrnYGdIDm7JaWGBODVRXWy7Psgwox54jXN9Hkww');

test.getNewCoins(function(balance){
	console.log(balance);
});
//test.pumpOrder("LTC",1,.0022);

