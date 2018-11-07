var express = require('express');
var data = require('./../private/db.json');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', data);
});

router.get('/privacy', (req, res) => {
  res.render('privacy', data)
})
router.get('/terms-and-conditions', (req, res) => {
  res.render('terms', data)
})
router.get('/general-data-protection-regulation', (req, res) => {
  res.render('gdpr', data)
})

module.exports = router;