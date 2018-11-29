var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();
var pagesJson = __dirname + '/../../private/pages.json';

router.post('/', (req, res) => {
  fs.readFile(pagesJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(addPage(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(pagesJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/pages/create');
        } else {
          res.redirect('/admin/pages');
        }
      })
    }
  })
})

router.post('/:id', (req, res) => {
  fs.readFile(pagesJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(updatePage(req.params.id, req.body, JSON.parse(data)), null, 2);
      fs.writeFile(pagesJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/pages/edit/' + req.params.id);
        } else {
          res.redirect('/admin/pages');
        }
      })
    }
  })
})

router.post('/:id/delete', (req, res) => {
  fs.readFile(pagesJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(deletePage(req.params.id, JSON.parse(data)), null, 2);
      fs.writeFile(pagesJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/pages/edit/' + req.params.id);
        } else {
          res.redirect('/admin/pages');
        }
      })
    }
  })
})

function addPage(data, pages) {
  var pageids = _.sortBy(_.without(_.keys(pages), 'cart', 'checkout'));
  var nextid = Number(pageids.pop()) + 1;
  pages[nextid] = data;
  return pages;
}

function updatePage(id, data, pages) {
  pages[id] = data;
  return pages;
}

function deletePage(id, pages) {
  pages = _.omit(pages, id);
  return pages;
}

module.exports = router;