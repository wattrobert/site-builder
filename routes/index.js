var express = require('express');
var router = express.Router();
var fs = require('fs');
var dbpath = __dirname + '/../private/db.json';

/* GET home page. */
router.get('/', function (req, res, next) {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  res.render('index', data);
});

router.get('/privacy', (req, res) => {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  data.header = {
    brand: data.header.brand,
    title: 'Privacy'
  }
  res.render('privacy', data)
});

router.get('/terms-and-conditions', (req, res) => {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  data.header = {
    brand: data.header.brand,
    title: 'Terms & Conditions'
  }
  res.render('terms', data)
});

router.get('/general-data-protection-regulation', (req, res) => {
  var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
  data.header = {
    brand: data.header.brand,
    title: 'GDPR Compliance',
    text: 'General data protection regulation'
  }
  res.render('gdpr', data)
});

module.exports = router;