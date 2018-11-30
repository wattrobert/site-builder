var express = require('express');
var fs = require('fs');
var _ = require('lodash');
var helpers = require('./../../helpers');
var router = express.Router();
var sectionsJson = __dirname + '/../../private/sections.json';

router.post('/', (req, res) => {
  fs.readFile(sectionsJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(addSection(req.body, JSON.parse(data)), null, 2);
      fs.writeFile(sectionsJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/sections/create');
        } else {
          res.redirect('/admin/sections');
        }
      })
    }
  })
})

router.post('/:id', (req, res) => {
  fs.readFile(sectionsJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(updateSection(req.params.id, req.body, JSON.parse(data)), null, 2);
      fs.writeFile(sectionsJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/sections/edit/' + req.params.id);
        } else {
          res.redirect('/admin/sections');
        }
      })
    }
  })
})

router.post('/:id/delete', (req, res) => {
  fs.readFile(sectionsJson, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send(JSON.parse(err));
    } else {
      var newData = JSON.stringify(deleteSection(req.params.id, JSON.parse(data)), null, 2);
      fs.writeFile(sectionsJson, newData, (err) => {
        if (err) {
          res.redirect(500, '/admin/sections/edit/' + req.params.id);
        } else {
          res.redirect('/admin/sections');
        }
      })
    }
  })
})

function addSection(data, sections) {
  var sectionids = _.sortBy(_.keys(sections));
  var nextid = Number(sectionids.pop()) + 1;
  sections[nextid] = data;
  return sections;
}

function updateSection(id, data, sections) {
  sections[id] = helpers.parseRequest(data, sections[id]);
  return sections;
}

function deleteSection(id, sections) {
  sections = _.omit(sections, id);
  return sections;
}

module.exports = router;