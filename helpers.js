let fs = require('fs');
var _ = require('lodash');
let products = __dirname + '/private/products.json';
let sections = __dirname + '/private/sections.json';
let pages = __dirname + '/private/pages.json';
let company = __dirname + '/private/company.json';
let admin = __dirname + '/private/admin.json';
let theme = __dirname + '/private/theme.json';

module.exports = {
  parseRequest: parseRequest,
  products: {
    get: getProducts,
    default: getProductDefault
  },
  sections: {
    get: getSections,
    default: getSectionDefault
  },
  pages: {
    get: getPages
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

function getProducts(id) {
  let data = JSON.parse(fs.readFileSync(products));
  return id ? Object.assign(data[id], {
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
  return id ? parseSection(Object.assign(data[id], {
    id: id
  })) : parse ? parseSections(data) : data;
}

function getSectionDefault(type) {
  return {
    type: type
  }
}

function getPages(id) {
  let data = JSON.parse(fs.readFileSync(pages));
  return id ? Object.assign(data[id], {
    id: id
  }) : data;
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