var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();
var productsJson = __dirname + '/../../private/products.json';

router.post('/', (req, res) => {
  fs.readFile(productsJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(addProduct(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(productsJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/products/create');
        } else {
          res.redirect('/admin/products');
        }
      })
    }
  })
})

router.post('/:id', (req, res) => {
  fs.readFile(productsJson, 'utf8', (err, data) => {
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

router.post('/:id/delete', (req, res) => {
  fs.readFile(productsJson, 'utf8', (err, data) => {
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

function addProduct(data, products) {
  var productids = _.sortBy(_.keys(products));
  var nextid = Number(productids.pop()) + 1;
  products[nextid] = data;
  return products;
}

function updateProduct(id, data, products) {
  products[id] = data;
  return products;
}

function deleteProduct(id, products) {
  products = _.omit(products, id);
  return products;
}

module.exports = router;