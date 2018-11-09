var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var router = express.Router();
var dbpath = __dirname + '/../private/db.json';

/* GET users listing. */
router.get('/config', (req, res, next) => {
  fs.readFile(dbpath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      res.status(200).json(JSON.parse(data));
    }
  })
});

router.put('/config', (req, res, next) => {
  var config = JSON.stringify(req.body, null, 2);
  fs.writeFile(dbpath, config, (err) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      res.status(200).send(JSON.parse(config));
    }
  })
})

router.post('/config', (req, res, next) => {
  // console.log(req.body);
  fs.readFile(dbpath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(parseRequest(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(dbpath, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin');
        } else {
          res.redirect('/');
        }
      })
    }
  })
  // var config = JSON.stringify(req.body, null, 2);
  // fs.writeFile(dbpath, config, (err) => {
  //   if (err) {
  //     res.status(500).send(JSON.parse(err));
  //   } else {
  //     res.status(200).send(JSON.parse(config));
  //   }
  // })
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