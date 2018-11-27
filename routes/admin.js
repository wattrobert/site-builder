var express = require('express');
var router = express.Router();
var fs = require('fs');
var dbpath = __dirname + '/../private/db.json';

/* GET home page. */
router.get('/', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('admin/index', data);
});

router.get('/products', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('admin/products', data);
});

router.get('/products/create', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  data.product = {
    currency: '$'
  };
  res.render('admin/product-create', data);
});

router.get('/products/edit/:id', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  data.product = data.products[req.params.id];
  data.productid = req.params.id;
  res.render('admin/product-edit', data);
});

router.get('/sections', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('admin/sections', data);
});

router.get('/company', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('admin/company', data);
});

module.exports = router;