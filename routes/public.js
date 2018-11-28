function generateRoutes(pages) {
  let express = require('express');
  let router = express.Router();
  let companyJson = __dirname + '/../private/company.json';
  let sectionsJson = __dirname + '/../private/sections.json';
  let productsJson = __dirname + '/../private/products.json';
  let _ = require('lodash');
  let fs = require('fs');

  _.forEach(pages, (page, id) => {
    router.get(page.path, (req, res, next) => {
      res.render('public/index', (function () {
        let result = Object.assign({
          id: id
        }, page);
        result.company = JSON.parse(fs.readFileSync(companyJson, 'utf8'));
        var sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
        var products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
        if (result.sections && result.sections.length) {
          result.sections = _.map(_.map(result.sections, (sectionid) => {
            var s = sections[sectionid];
            s.id = sectionid;
            return s;
          }), (section) => {
            section.product = section.type === 'product' ? products[section.productid] : null;
            return section;
          })
        } else {
          result.sections = [];
        }
        return result;
      })())
    })
  })

  return router;
}

module.exports = generateRoutes;