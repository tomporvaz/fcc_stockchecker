/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const axios = require('axios');


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
//connect to database using mongoose

module.exports = function (app) {
  
  app.route('/api/stock-prices')
  .get(function (req, res){
    
    //test axios with alpha vantage api
    const apiURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.body.stock}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`
    axios.get(apiURL)
    .then(res => console.log(res))
    .catch(error => console.log('Error', error));


    //create response for only one stock ticker
    
    //create resonse for two stock tickers
    
  });
  
};
