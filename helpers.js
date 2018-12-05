let fs = require('fs');
var _ = require('lodash');
let products = __dirname + '/private/products.json';
let sections = __dirname + '/private/sections.json';
let pages = __dirname + '/private/pages.json';
let company = __dirname + '/private/company.json';
let admin = __dirname + '/private/admin.json';
let theme = __dirname + '/private/theme.json';
let hiddenIds = ['cart', 'checkout', 'shop'];

module.exports = {
  nextId: getNextId,
  parseRequest: parseRequest,
  formatMoney: formatMoney,
  products: {
    get: getProducts,
    default: getProductDefault
  },
  sections: {
    get: getSections,
    default: getSectionDefault
  },
  pages: {
    get: getPages,
    create: createPage,
    update: updatePage,
    delete: deletePage
  },
  company: {
    get: getCompany,
    update: updateCompany
  },
  admin: {
    get: getAdmin
  },
  theme: {
    get: getTheme
  }
}

function getNextId(data) {
  let ids = _.sortBy(_.without(_.keys(data), hiddenIds));
  return String(Number(ids.pop()) + 1);
}

function getProducts(id) {
  let data = JSON.parse(fs.readFileSync(products));
  return id ? Object.assign({}, data[id], {
    id: id
  }) : data;
}

function getProductDefault() {
  return {
    currency: '$'
  }
}

function getSections(id, parse) {
  let data = JSON.parse(fs.readFileSync(sections));
  return id ? parseSection(Object.assign({
    button: {
      link: '',
      text: ''
    }
  }, data[id], {
    id: id,

  })) : parse ? parseSections(data) : data;
}

function getSectionDefault(type) {
  let result = {
    type: type,
    button: {
      text: '',
      link: ''
    }
  }
  return result;
}

function getPages(id) {
  let data = JSON.parse(fs.readFileSync(pages));
  return id ? Object.assign(data[id], {
    id: id
  }) : data;
}

function createPage(data, callback) {
  let allPages = getPages();

  let newPage = Object.assign({}, data);
  newPage.sections = newPage.sections.split(',');

  let newData = Object.assign({}, allPages);
  newData[getNextId(allPages)] = newPage;

  fs.writeFile(pages, JSON.stringify(newData, null, 2), callback);
}

function updatePage(id, data, callback) {
  let allPages = getPages();

  let updatedPage = Object.assign({}, data);
  updatedPage.sections = updatedPage.sections.split(',');

  let newData = Object.assign({}, allPages);
  newData[id] = updatedPage;

  fs.writeFile(pages, JSON.stringify(newData, null, 2), callback);
}

function deletePage(id, callback) {
  let allPages = getPages();

  let newData = Object.assign({}, allPages);
  newData = _.omit(newData, id);

  fs.writeFile(pages, JSON.stringify(newData, null, 2), callback);
}

function getCompany() {
  return JSON.parse(fs.readFileSync(company));
}

function updateCompany(data, callback) {
  fs.writeFile(company, data, callback)
}

function getAdmin() {
  return JSON.parse(fs.readFileSync(admin));
}

function getTheme() {
  return JSON.parse(fs.readFileSync(theme));
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

function parseSection(section) {
  if (section.type === 'product') {
    section.product = getProducts(section.productid);
  }
  if (section.type === 'shop') {
    let products = getProducts();
    section.products = _.compact(_.map(section.productids, (pid) => {
      let p = products[pid];
      if (p) {
        p.id = pid;
        return p;
      }
    }));
  }
  return section;
}

function parseSections(sections) {
  let products = getProducts();
  return _.map(sections, (section, id) => {
    section.id = id;
    if (section.type === 'showcase') {
      section.product = products[section.productid];
    }
    return section;
  })
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};