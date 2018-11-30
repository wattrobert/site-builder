const fs = require('fs');
const _ = require('lodash');

function dynamicRoutes(req, res, next) {
  if (req.url.indexOf('/admin') === 0) return next();
  if (req.url.indexOf('/api') === 0) return next();
  let company = JSON.parse(fs.readFileSync(__dirname + '/../private/company.json'));
  let sections = JSON.parse(fs.readFileSync(__dirname + '/../private/sections.json'));
  let allPages = JSON.parse(fs.readFileSync(__dirname + '/../private/pages.json'));

  let pathMatch = _.keys(_.pickBy(allPages, {
    path: req.url
  }));

  if (pathMatch.length) {
    let page = Object.assign({
      id: pathMatch[0]
    }, allPages[pathMatch[0]]);

    page.navItems = buildNavItems(allPages);
    page.company = company;
    page.sections = buildSections(page, sections);

    res.render('public/index', page)
  } else {
    res.render('public/404');
  }

}

function buildNavItems(pages) {
  return _.groupBy(_.filter(pages, (page) => {
    return page.nav !== 'none';
  }), 'nav');
}

function buildSections(page, allSections) {
  let products = JSON.parse(fs.readFileSync(__dirname + '/../private/products.json'));
  return _.map(_.map(page.sections, (sectionid) => {
    var s = allSections[sectionid];
    s.id = sectionid;
    return s;
  }), (section) => {
    section.product = (section.type === 'showcase' ? products[section.productid] : null);
    return section;
  })
}




module.exports = dynamicRoutes;