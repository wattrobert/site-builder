var express = require('express');
var router = express.Router();
var fs = require('fs');
var dbpath = __dirname + '/../private/db.json';

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.headers);
    var data = JSON.parse(fs.readFileSync(dbpath, 'utf8'));
    res.render('admin', data);
});

module.exports = router;