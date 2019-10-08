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
  likes: {type: Number},
  IP: [String]
});

const Stock = mongoose.model('Stock', stockSchema);


module.exports = function (app) {
  
  app.route('/api/stock-prices')
  .get(function (req, res){
    
    if(typeof req.query.stock === 'string'){
      
      //create response for only one stock ticker
      findUpdatePriceSingleStock(req.query.stock, req.query.like, req.ip)
      .then(stockDocObj => {
        res.json(stockDocObj)
      });
    } else if(typeof req.query.stock === 'object'){
      const stock1 = req.query.stock[0];
      const stock2 = req.query.stock[1];
      //create resonse for two stock tickers
      findUpdateTwoStocks(req.query.stock[0], req.query.stock[1], req.query.like, req.ip);      
    }
  });

  //async function to compose the results of two promises
  const findUpdateTwoStocks = async function(stock1, stock2, usersLike, userIP){
    const stock1Promise = await findUpdatePriceSingleStock(stock1, usersLike, userIP);
    const stock2Promise = await findUpdatePriceSingleStock(stock2, usersLike, userIP);

    //compose stockPromises into one response
    stock1Promise.then((stock1obj) => {
      res.json({
        "stockData": [
          {
            "stock": stock1obj.stock,
            "price": stock1obj.price,
            "rel_likes": "finish calculation for this code"
          },
          {
            "stock": stock2Promise.stock,
            "price": stock2Promise.price,
            "rel_likes": "finish calculation for this code"
          }
        ]
      })
    })
  }
  
  //findUpdatePriceSingleStock adds the price to the findUpdateStock promise
  const findUpdatePriceSingleStock = function(usersStock, usersLike, userIP) {
    return new Promise((resolve, reject) => {
      findUpdateStock(usersStock, usersLike, userIP)
      .then(value => addStockPrice(value))
      /* .then(value => {
        console.log("PROMISE CHAIN OUTPUT");
        console.log(value);
      }) */
      .then(stockDocObj => {
        resolve({"stockData": 
        {
          "stock": stockDocObj.stock,
          "price": stockDocObj.price,
          "likes": stockDocObj.likes
        }
      })
    })
    .catch(error => reject('Error: ', error)); 
  })
}


//function findUpdateStock, updates or creates stock document in Mongo, 
//and returns promise with object
const findUpdateStock = function (usersStock, usersLike, userIP) {
  usersStock = usersStock.toUpperCase();
  let newStock = new Stock({
    stock: usersStock,
    likes: 0,
    IP: []
  });
  let returnedStock = {};
  console.log("we made inside the findUpdateStock function");
  return new Promise ((resolve, reject) => {
    Stock.findOne({stock: usersStock}, function (err, stockDoc){
      if(err){
        console.error(err)
        reject(err);
      };
      console.log("callback in findOne! stockDoc is next...");
      console.log(stockDoc);
      
      //logic splits here if stock is found or not
      if(!stockDoc){
        if(usersLike){
          newStock.likes++;
        };
        newStock.IP.push(userIP);
        newStock.save(function (err, savedStockDoc){
          if(err){console.error(err)};
          resolve(newStock);
        })
      } else {
        if(stockDoc.IP.includes(userIP)){
          //nothing happens
        } else { 
          if(usersLike) {
            stockDoc.likes++;
          }
          newStock.IP = stockDoc.IP.push(userIP);
        }
        Stock.updateOne({_id: stockDoc._id}, stockDoc, function(err, rawUpdateResponse){
          if(err){console.error(err)};
          resolve(stockDoc);
        })
      }
      
    })
  });
}

//function fetches price from AlphaVantage API and returns stock document promise
const addStockPrice = function (stockDoc) {
  return new Promise ((resolve, reject) => {
    let stockDocClone = {...stockDoc._doc}
    const apiURL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockDoc.stock}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
    //call axios with alpha vantage api
    axios.get(apiURL)
    .then(response => {
      stockDocClone.price = response.data['Global Quote']['05. price']
      console.log(`AXIOS Promise - Stock Price: ${response.data['Global Quote']['05. price']}`);
      resolve(stockDocClone);
      
    })
    .catch(error => {
      console.log('Error', error)
      reject(error);
    });
  })
}

};
