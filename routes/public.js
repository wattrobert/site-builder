const fs = require('fs');
const _ = require('lodash');

function generateRoutes(req, res, next) {
  if (req.url.indexOf('/admin') === 0) return next();
  if (req.url.indexOf('/api') === 0) return next();
  let sections = JSON.parse(fs.readFileSync(__dirname + '/../private/sections.json'));
  let products = JSON.parse(fs.readFileSync(__dirname + '/../private/products.json'));
  let filteredPages = _.pickBy(JSON.parse(fs.readFileSync(__dirname + '/../private/pages.json')), {
    path: req.url
  });
  let pageid = _.keys(filteredPages)[0];
  let page = Object.assign({
    id: pageid
  }, filteredPages[pageid]);
  console.log(page);
  page.company = fs.readFileSync(__dirname + '/../private/company.json');
  page.id = pageid;
  page.sections = _.map(_.map(page.sections, (sectionid) => {
    var s = sections[sectionid];
    s.id = sectionid;
    return s;
  }), (section) => {
    section.product = (section.type === 'product' ? products[section.productid] : null);
    return section;
  })
  res.render('public/index', page)
  // let express = require('express');
  // let router = express.Router();
  // let companyJson = __dirname + '/../private/company.json';
  // let sectionsJson = __dirname + '/../private/sections.json';
  // let productsJson = __dirname + '/../private/products.json';
  // let _ = require('lodash');

  // _.forEach(pages, (page, id) => {
  //   router.get(page.path, (req, res, next) => {
  //     page = JSON.parse(fs.readFileSync(pagesJson, 'utf8'))[id];
  //     let sections = JSON.parse(fs.readFileSync(sectionsJson, 'utf8'));
  //     let products = JSON.parse(fs.readFileSync(productsJson, 'utf8'));
  //     res.setHeader('Cache-Control', 'no-cache')
  //     res.render('public/index', (function () {
  //       let result = Object.assign({
  //         id: id
  //       }, page);
  //       result.company = JSON.parse(fs.readFileSync(companyJson, 'utf8'));
  //       if (result.sections && result.sections.length) {
  //         result.sections = _.map(_.map(result.sections, (sectionid) => {
  //           var s = sections[sectionid];
  //           s.id = sectionid;
  //           return s;

  //         }), (section) => {
  //           section.product = (section.type === 'product' ? products[section.productid] : null);
  //           return section;
  //         })
  //       } else {
  //         result.sections = [];
  //       }
  //       return result;
  //     })())
  //   })
  // })

  // return router;
}

module.exports = generateRoutes;