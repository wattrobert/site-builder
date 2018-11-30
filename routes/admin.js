var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var companyJson = __dirname + '/../private/company.json';
var sectionsJson = __dirname + '/../private/sections.json';
var productsJson = __dirname + '/../private/products.json';
var pagesJson = __dirname + '/../private/pages.json';
var adminData = JSON.parse(fs.readFileSync(__dirname + '/../private/admin.json'));

var hiddenSections = ['CART', 'CHECKOUT']

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
  try {
    var data = Object.assign({
      pages: pages
    }, adminData);
    res.render('admin/pages/list', data);
  } catch (ex) {
    console.log(ex);

  }
});

router.get('/pages/create', function (req, res, next) {
  var pages = JSON.parse(fs.readFileSync(pagesJson, 'utf8'));
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/pages/create', Object.assign({
    pages: pages,
    sections: _.omit(sections, hiddenSections),
    page: {
      sections: []
    }
  }, adminData));
})

router.get('/pages/edit/:id', function (req, res, next) {
  var pages = JSON.parse(fs.readFileSync(pagesJson, 'utf8'));
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/pages/edit', Object.assign({
    sections: _.map(sections, resolveSectionReferences)
  }, resolveReferences(pages[req.params.id], req.params.id), adminData));
})

router.get('/sections', function (req, res, next) {
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/sections/list', Object.assign({
    sections: _.map(sections, resolveSectionReferences)
  }, adminData));
});

router.get('/sections/create/:type', function (req, res, next) {
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/sections/create', Object.assign({
    sections: sections
  }, {
    section: {
      type: req.params.type
    }
  }, adminData));
})

router.get('/sections/edit/:id', function (req, res, next) {
  var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  res.render('admin/sections/edit', Object.assign({
    sections: sections
  }, {
    section: resolveSectionReferences(sections[req.params.id])
  }, adminData));
})

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
  return result;
}

function resolveSectionReferences(section, id) {
  if (id) section.id = id;
  if (section.type === 'product') {
    var products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
    section.product = products[section.productid];
  }
  return section;
}

module.exports = router;