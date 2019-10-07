/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  suite('GET /api/stock-prices => stockData object', function() {
    let testLikes = 0;
    
    test('1 stock', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'goog'})
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, 'goog');
        
        done();
      });
    });
    
    test('1 stock with like', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'goog', like: true})
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, 'goog');
        assert.isAbove(res.body.stockData.likes, 0);
        testLikes = res.body.stockData.likes;
        
        done();
      });
    });
    
    test('1 stock with like again (ensure likes arent double counted)', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'goog', like: true})
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData, 'stock');
        assert.property(res.body.stockData, 'price');
        assert.property(res.body.stockData, 'likes');
        assert.equal(res.body.stockData.stock, 'goog');
        assert.equal(res.body.stockData.likes, testLikes);
  
        done();
      });
    });
    
    test('2 stocks', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'goog', stock: 'amzn'})
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[0], 'price');
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'stock');
        assert.property(res.body.stockData[1], 'price');
        assert.property(res.body.stockData[1], 'rel_likes');
        assert.equal(res.body.stockData[0].stock, 'goog');
        assert.equal(res.body.stockData[1].stock, 'amzn');
  
        done();
      });
      
    });
    
    test('2 stocks with like', function(done) {
      chai.request(server)
      .get('/api/stock-prices')
      .query({stock: 'goog', stock: 'amzn', like: true})
      .end(function(err, res){
        if(err){console.error(err)};
        
        assert.equal(res.status, 200);
        assert.property(res.body, 'stockData');
        assert.property(res.body.stockData[0], 'stock');
        assert.property(res.body.stockData[0], 'price');
        assert.property(res.body.stockData[0], 'rel_likes');
        assert.property(res.body.stockData[1], 'stock');
        assert.property(res.body.stockData[1], 'price');
        assert.property(res.body.stockData[1], 'rel_likes');
        assert.equal(res.body.stockData[0].stock, 'goog');
        assert.equal(res.body.stockData[1].stock, 'amzn');
        assert.equal(res.body.stockData[0].rel_likes, 0);
        assert.equal(res.body.stockData[1].rel_likes, 0);
  
        done();
      });
      
    });
    
  });
  
});
