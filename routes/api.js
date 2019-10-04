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
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
//connect to database using mongoose
mongoose.connect(CONNECTION_STRING || 'mongodb://localhost/exercise-track' )
  //from quick start guide in mongoose docs
  let db = mongoose.connection;
  db.on("error", console.error.bind(console, 'connection error'));
  db.once('open', function (){
    console.log("DB sucess using mongoose!")
  });
  
  //issue schema and model
  const stockSchema = new Schema({
    stock: {type: String, required: true},
    likes: {type: Number}
  });

  const Stock = mongoose.model('Stock', stockSchema);


module.exports = function (app) {
  
  app.route('/api/stock-prices')
  .get(function (req, res){
    
    //test axios with alpha vantage api
    const apiURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=
    ${req.query.stock}&apikey=
    ${process.env.ALPHAVANTAGE_API_KEY}`;
    
    axios.get(apiURL)
    .then(response => console.log(response.data))
    .catch(error => console.log('Error', error));


    //create response for only one stock ticker
    
    //create resonse for two stock tickers
    
  });
  
};
