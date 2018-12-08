var express = require('express');
var router = express.Router();
var helpers = require('./../../helpers');
var pug = require('pug');
var viewPath = __dirname + '/../../views';

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
    var compiledFunction = pug.compileFile(viewPath + '/admin/includes/sortable-sections.pug')
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
    console.log(ex);
    res.render('/error', ex);
  }
})

module.exports = router;







//layouts will have 

//sections can have 1 of these 3 configs:
//----1 => component array (simple)
//----2 => column array (medium)
//----3 => layers array (complex)

//layers can have 1 of 2 types:
//----1 => compontents (complex)
//----2 => columns (most complex)

var example = {
  "site": {
    "url": "https://www.sitebuilder.io",
    "company": {
      //company info
    },
    "brand": "brandExample",
    "pages": ["pageExample"]
  },
  "brandExample": {
    "header": {
      "font": "AA",
      "size": 48
    },
    "body": {
      "font": "BB",
      "size": 16
    },
    "colors": {
      "primary": "w",
      "secondary": "x",
      "dark": "y",
      "light": "z"
    }
  },
  "pageExample": {
    "path": "/home",
    "layout": "layoutExample",
    "scripts": ["/plugins/selectize.js", "/plugins/sweetAlert2.js"]
  },
  "layoutExample": {
    "type": "left-nav || top-nav || fixed-top-navl/b n 7bopm;/'",
    "navigation": "{{navigation.config.reference}} || false",
    "header": "{{header.config.reference}} || false",
    "footer": "{{footer.config.reference}} || false",
    "contained": true,
    "sections": ["section1", "section2", "section3"]
  },
  "sections": {
    "section1": {
      "components": ["componentA"] //vertical
    },
    "section2": {
      "columns": [ //horizontal
        {
          "width": 25,
          "components": ["componentB", "componentC"]
        },
        {
          "width": 75,
          "components": ["componentD", "componentE"]
        }
      ]
    },
    "section3": {
      "layers": [ //stacked z-index
        {
          "depth": 1,
          "columns": [ //horizontal
            {
              "width": 25,
              "components": ["componentF", "componentG"]
            },
            {
              "width": 75,
              "components": ["componentH", "componentI"]
            }
          ]
        },
        {
          "depth": 0,
          "components": ["componentJ"] //vertical
        }
      ]
    }
  }
}