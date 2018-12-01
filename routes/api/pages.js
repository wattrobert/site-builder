var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();
var helpers = require('./../../helpers');
var pagesJson = __dirname + '/../../private/pages.json';
var productsJson = __dirname + '/../../private/products.json';
var sectionsJson = __dirname + '/../../private/sections.json';
var adminData = JSON.parse(fs.readFileSync(__dirname + '/../../private/admin.json'));
var pug = require('pug');

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

router.get('/sections/refresh', (req, res) => {
  try {
    var compiledFunction = pug.compileFile('views/admin/includes/sortable-sections.pug')
    var compileData = {
      page: {
        sections: req.query.sections
      },
      sections: {}
    }

    helpers.sections.get(null, true).forEach((s) => {
      compileData.sections[s.id] = s;
    })

    res.send(compiledFunction(compileData));
  } catch (ex) {
    console.log(ex);
    res.status(500).send();
  }
})

function addPage(data, pages) {
  var pageids = _.sortBy(_.without(_.keys(pages), ['cart', 'checkout']));
  var nextid = Number(pageids.pop()) + 1;
  data.sections = data.sections.split(',');
  pages[nextid] = data;
  return pages;
}

function updatePage(id, data, pages) {
  data.sections = data.sections.split(',');
  pages[id] = data;
  return pages;
}

function deletePage(id, pages) {
  pages = _.omit(pages, id);
  return pages;
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