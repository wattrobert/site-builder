var express = require('express');
var router = express.Router();
var _ = require('lodash');
var fs = require('fs');
var dbpath = __dirname + '/../private/db.json';

/* GET home page. */
router.get('/', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('public/index', resolveReferences(data));
});

router.get('/cart', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('public/cart', data);
});

router.get('/checkout', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('public/checkout', data);
});

function resolveReferences(data) {
  data.content = _.map(_.map(data.content, sectionId => {
    return data.sections[sectionId];
  }), section => {
    if (section.type === 'product') {
      section.product = data.products[section.productid];
    }
    return section;
  });
  return data;
}

module.exports = router;