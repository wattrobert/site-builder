var express = require('express');
var router = express.Router();
var helpers = require('./../../helpers');

router.post('/', (req, res, next) => {
  var newData = JSON.stringify(helpers.parseRequest(req.body, helpers.company.get()), null, 2);
  helpers.company.update(newData, (err) => {
    if (err) res.status(500);
    res.redirect('/admin/company');
  });
})

module.exports = router;