const _ = require('lodash');
const helpers = require('./../helpers');

function dynamicRoutes(req, res, next) {
  if (req.url.indexOf('/admin') === 0) return next();
  if (req.url.indexOf('/api') === 0) return next();

  let sections = helpers.sections.get();
  let allPages = helpers.pages.get();
  let products = helpers.products.get();
  let company = helpers.company.get();
  let navItems = buildNavItems(allPages);
  let cart = buildCart(req.cookies.cart, products);

  let pathMatch = _.keys(_.pickBy(allPages, {
    path: req.url
  }));


  if (pathMatch.length) {
    let page = Object.assign({}, {
      id: pathMatch[0]
    }, allPages[pathMatch[0]]);

    page.navItems = navItems;
    page.company = company;
    page.sections = buildSections(page, sections, products);
    page.cart = cart;

    return res.render('public/index', page)
  }

  let productId = checkProductPage(req.url, allPages);
  if (productId) {
    let page = Object.assign({
      id: 'product',
      navItems: navItems,
      company: company,
      cart: cart,
      sections: [{
        id: 'product',
        type: 'product',
        product: helpers.products.get(productId),
      }]
    });
    return res.render('public/index', page);
  }

  return res.render('public/404');
}

function checkProductPage(path, pages) {
  let shopPages = _.filter(pages, (p) => {
    return p.sections.includes('shop');
  });

  if (shopPages.length) {
    let pathMatch = _.filter(shopPages, (p) => {
      return path.indexOf(p.path.split('/')[1]) > -1;
    });
    if (pathMatch && pathMatch.length) {
      let split = path.split('/');
      let productIdIndex = split.indexOf('product') + 1;
      return split[productIdIndex];
    }
  }

  return false;
}

function buildNavItems(pages) {
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
        total += parseInt(product.price);
        product.id = p;
        return product;
      }));
    }
    return {
      items: cartItems,
      subtotal: helpers.formatMoney(total, 2, ".", ",")
    }
  } else {
    return {
      items: [],
      subtotal: helpers.formatMoney(0, 2, ".", ",")
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