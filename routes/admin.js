var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var companyJson = __dirname + '/../private/company.json';
var sectionsJson = __dirname + '/../private/sections.json';
var productsJson = __dirname + '/../private/products.json';
var pagesJson = __dirname + '/../private/pages.json';
var adminData = {
  "url": "https://www.sitebuilder.io",
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
  res.render('admin/products/list', Object.assign({
    products: products
  }, adminData));
});

router.get('/products/create', function (req, res, next) {
  res.render('admin/products/create', Object.assign({
    product: {
      currency: '$'
    }
  }, adminData));
});

router.get('/products/edit/:id', function (req, res, next) {
  var products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
  res.render('admin/products/edit', Object.assign({
    product: Object.assign({
      id: req.params.id
    }, products[req.params.id]),
  }, adminData));
});

router.get('/pages', function (req, res, next) {
  var pages = JSON.parse(fs.readFileSync(pagesJson, 'utf8'));
  res.render('admin/pages/list', Object.assign({
    pages: pages
  }, adminData));
});

router.get('/pages/create', function (req, res, next) {
  var pages = JSON.parse(fs.readFileSync(pagesJson, 'utf8'));
  res.render('admin/pages/create', Object.assign({
    pages: pages,
    page: {}
  }, adminData));
})

router.get('/pages/edit/:id', function (req, res, next) {
  var pages = JSON.parse(fs.readFileSync(pagesJson, 'utf8'));
  res.render('admin/pages/edit', Object.assign(resolveReferences(pages[req.params.id], req.params.id), adminData));
})

router.get('/sections', function (req, res, next) {
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/sections/list', Object.assign({
    sections: sections
  }, adminData));
});

router.get('/company', function (req, res, next) {
  var company = JSON.parse(fs.readFileSync(companyJson, 'utf8'));
  res.render('admin/company', Object.assign({
    company: company
  }, adminData));
});

function resolveReferences(page, id) {
  let result = {
    page: Object.assign({
      id: id
    }, page)
  };
  result.company = JSON.parse(fs.readFileSync(companyJson, 'utf8'));
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  var products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
  if (result.page.sections && result.page.sections.length) {
    result.page.sections = _.map(_.map(result.page.sections, (sectionid) => {
      var s = sections[sectionid];
      s.id = sectionid;
      return s;
    }), (section) => {
      section.product = section.type === 'product' ? products[section.productid] : null;
      return section;
    })
  } else {
    result.page.sections = [];
  }
  return result;
}

module.exports = router;