const _ = require('lodash');
const helpers = require('./../helpers');

function dynamicRoutes(req, res, next) {
  if (req.url.indexOf('/admin') === 0) return next();
  if (req.url.indexOf('/api') === 0) return next();

  let sections = helpers.sections.get();
  let allPages = helpers.pages.get();
  let products = helpers.products.get();
  let pathMatch = _.keys(_.pickBy(allPages, {
    path: req.url
  }));

  if (pathMatch.length) {
    let page = Object.assign({}, {
      id: pathMatch[0]
    }, allPages[pathMatch[0]]);

    page.navItems = buildNavItems(page, allPages);
    page.company = helpers.company.get();
    page.sections = buildSections(page, sections, products);
    page.cart = buildCart(req.cookies.cart, products)

    res.render('public/index', page)
  } else {
    res.render('public/404');
  }

}

function buildNavItems(page, pages) {
  return _.groupBy(_.filter(pages, (page) => {
    return page.nav !== 'none';
  }), 'nav');
}

function buildCart(cookie, products) {
  if (typeof cookie === 'string' && cookie.length > 0) {
    var cartItems = cookie.split(',');
    var total = 0;
    if (cartItems.length) {
      var cartItems = _.compact(_.map(cartItems, (p) => {
        let product = Object.assign({}, products[p]);
        total += Number(product.price);
        product.id = p;
        return product;
      }));
      total = String(total).split('.')[0] + '.' + String(total).split('.')[1].slice(0, 2);
    }
    return {
      items: cartItems,
      subtotal: total
    }
  } else {
    return {
      items: [],
      subtotal: 0
    }
  }

}

function buildSections(page, allSections, products) {
  return _.map(_.map(page.sections, (sectionid) => {
    var s = allSections[sectionid];
    s.id = sectionid;
    return s;
  }), (section) => {
    section.product = (section.type === 'showcase' ? products[section.productid] : null);
    section.products = (section.type === 'shop' ? _.compact(_.map(section.productids, (pid) => {
      let p = products[pid];
      if (p) {
        p.id = pid;
        return p;
      }
    })) : null);
    return section;
  })
}




module.exports = dynamicRoutes;