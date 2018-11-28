var express = require('express');
var router = express.Router();
var fs = require('fs');
var companyJson = __dirname + '/../private/company.json';
var sectionsJson = __dirname + '/../private/sections.json';
var productsJson = __dirname + '/../private/products.json';
var pagesJson = __dirname + '/../private/pages.json';
var adminData = {
  "meta": {
    "title": "Site Builder",
    "description": "Ultra-fast company websites for whoever needs 'em",
    "image": null
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/admin/pages');
});

router.get('/products', function (req, res, next) {
  var products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
  res.render('admin/products', Object.assign({
    products: products
  }, adminData));
});

router.get('/products/create', function (req, res, next) {
  res.render('admin/product-create', Object.assign({
    product: {
      currency: '$'
    }
  }, adminData));
});

router.get('/products/edit/:id', function (req, res, next) {
  var products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
  res.render('admin/product-edit', Object.assign({
    product: products[req.params.id],
    productid: req.params.id
  }, adminData));
});

router.get('/pages', function (req, res, next) {
  var pages = JSON.parse(fs.readFileSync(pagesJson, 'utf8'));
  res.render('admin/pages', Object.assign({
    pages: pages
  }, adminData));
});

router.get('/sections', function (req, res, next) {
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/sections', Object.assign({
    sections: sections
  }, adminData));
});

router.get('/company', function (req, res, next) {
  var company = JSON.parse(fs.readFileSync(companyJson, 'utf8'));
  res.render('admin/company', Object.assign({
    company: company
  }, adminData));
});

module.exports = router;