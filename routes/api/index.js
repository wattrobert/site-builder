var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();
var dbpath = __dirname + '/../../private/db.json';

router.post('/company', (req, res, next) => {
  fs.readFile(dbpath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(updateCompany(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(dbpath, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/company');
        } else {
          res.redirect('/admin/company');
        }
      })
    }
  })
})

router.post('/product', (req, res, next) => {
  fs.readFile(dbpath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(addProduct(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(dbpath, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/products/create');
        } else {
          res.redirect('/admin/products');
        }
      })
    }
  })
})

router.post('/product/:id', (req, res, next) => {
  fs.readFile(dbpath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(updateProduct(req.params.id, req.body, JSON.parse(data)), null, 2);
      fs.writeFile(dbpath, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/products/edit/' + req.params.id);
        } else {
          res.redirect('/admin/products');
        }
      })
    }
  })
})

router.post('/product/:id/delete', (req, res, next) => {
  fs.readFile(dbpath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(deleteProduct(req.params.id, JSON.parse(data)), null, 2);
      fs.writeFile(dbpath, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/products/edit/' + req.params.id);
        } else {
          res.redirect('/admin/products');
        }
      })
    }
  })
})

function addProduct(productData, allData) {
  var productids = _.sortBy(_.keys(allData.products));
  var nextid = Number(productids.pop()) + 1;
  allData.products[nextid] = productData;
  return allData;
}

function updateProduct(id, productData, allData) {
  allData.products[id] = productData;
  return allData;
}

function deleteProduct(id, allData) {
  allData.products = _.omit(allData.products, id);
  return allData;
}

function updateCompany(companyData, allData) {
  allData.company = parseRequest(companyData, allData.company);
  return allData;
}

function parseRequest(formBody, previousData) {
  _.forEach(formBody, function (value, key) {
    index(previousData, key, value);
  })
  return previousData;
}

function index(obj, is, value) {
  if (typeof is == 'string')
    return index(obj, is.split('.'), value);
  else if (is.length == 1 && value !== undefined)
    return obj[is[0]] = value;
  else if (is.length == 0)
    return obj;
  else
    return index(obj[is[0]], is.slice(1), value);
}
module.exports = router;