var express = require('express');
var router = express.Router();
var helpers = require('./../../helpers');
var pug = require('pug');
var path = require('path');

router.post('/', (req, res) => {
  helpers.pages.create(req.body, (err) => {
    if (err) res.status(500);
    res.redirect('/admin/pages');
  })
})

router.post('/:id', (req, res) => {
  helpers.pages.update(req.params.id, req.body, (err) => {
    if (err) res.status(500);
    res.redirect('/admin/pages');
  })
})

router.post('/:id/delete', (req, res) => {
  helpers.pages.delete(req.params.id, (err) => {
    if (err) res.status(500);
    res.redirect('/admin/pages');
  })
})

router.get('/sections/refresh', (req, res) => {
  try {
    var compiledFunction = pug.compileFile(path.join(app.get('views'), 'option.pug'))
    var compileData = {
      page: {
        sections: req.query.sections
      },
      sections: {}
    }

    helpers.sections.get(null, true).forEach((s) => {
      compileData.sections[s.id] = s;
    })

    res.send(compiledFunction(compileData));
  } catch (ex) {
    throw (ex);
  }
})

module.exports = router;