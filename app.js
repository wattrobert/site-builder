var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var publicRouter = require('./routes/public');
var adminRouter = require('./routes/admin');
var productsApi = require('./routes/api/products');
var companyApi = require('./routes/api/company');
var pagesApi = require('./routes/api/pages');
var sectionsApi = require('./routes/api/sections');

var app = express();

// view engine setup
app.disable('view cache');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(publicRouter);
app.use('/admin', adminRouter);
app.use('/api/products', productsApi);
app.use('/api/company', companyApi);
app.use('/api/pages', pagesApi);
app.use('/api/sections', sectionsApi);
app.get('/api/pages/sections/refresh', (req, res) => {
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', err);
});

module.exports = app;