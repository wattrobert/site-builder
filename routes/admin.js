var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ = require('lodash');
var helpers = require('./../helpers');
var adminData = JSON.parse(fs.readFileSync(__dirname + '/../private/admin.json'));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/admin/pages');
});

router.get('/products', function (req, res, next) {
  res.render('admin/products/list', Object.assign({}, {
    products: helpers.products.get()
  }, helpers.admin.get()));
});

router.get('/products/create', function (req, res, next) {
  res.render('admin/products/create', Object.assign({}, {
    product: helpers.products.default()
  }, helpers.admin.get()));
});

router.get('/products/edit/:id', function (req, res, next) {
  res.render('admin/products/edit', Object.assign({}, {
    product: helpers.products.get(req.params.id)
  }, helpers.admin.get()));
});

router.get('/pages', function (req, res, next) {
  res.render('admin/pages/list', Object.assign({
    pages: helpers.pages.get()
  }, helpers.admin.get()));
});

router.get('/pages/create', function (req, res, next) {
  res.render('admin/pages/create', Object.assign({}, {
    pages: helpers.pages.get(),
    sections: helpers.sections.get(null, true),
    page: {
      sections: []
    }
  }, helpers.admin.get()));
})

router.get('/pages/edit/:id', function (req, res, next) {
  let sections = helpers.sections.get();
  let products = helpers.products.get();

  _.forEach(sections, (s, id) => {
    sections[id].id = id;
    if (s.type === 'showcase') {
      sections[id].product = products[s.productid];
    };
  })

  res.render('admin/pages/edit', Object.assign({}, {
    sections: sections,
    page: helpers.pages.get(req.params.id)
  }, helpers.admin.get()));
})

router.get('/sections', function (req, res, next) {
  res.render('admin/sections/list', Object.assign({}, {
    sections: helpers.sections.get(null, true)
  }, helpers.admin.get()));
});

router.get('/sections/create/:type', function (req, res, next) {
  res.render('admin/sections/create', Object.assign({}, {
    section: helpers.sections.default(req.params.type)
  }, {
    sections: helpers.sections.get(),
    products: helpers.products.get()
  }, helpers.admin.get()));
})

router.get('/sections/edit/:id', function (req, res, next) {
  res.render('admin/sections/edit', Object.assign({}, {
    section: helpers.sections.get(req.params.id)
  }, {
    products: helpers.products.get()
  }, helpers.admin.get()));
})

router.get('/company', function (req, res, next) {
  res.render('admin/company', Object.assign({}, {
    company: helpers.company.get()
  }, adminData));
});

module.exports = router;