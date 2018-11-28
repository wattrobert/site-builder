var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();
var companyJson = __dirname + '/../../private/company.json';

router.post('/', (req, res, next) => {
  fs.readFile(companyJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(parseRequest(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(companyJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/company');
        } else {
          res.redirect('/admin/company');
        }
      })
    }
  })
})

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
module.exports = router;