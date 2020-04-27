const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const cookieParser = require('cookie-parser');
const configRoutes = require("./routes");
const session = require('express-session');


var exphbs = require("express-handlebars");
var hbs = exphbs.create({
  helpers: {
      eq: function (a, b, opts) { 
        if (a == b) 
        {
          return opts.fn(this);
        } 
        else 
        {
          return opts.inverse(this);
        } 
    }
  },
  defaultLayout: 'main'
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  name: 'AuthCookie',
  secret: 'secret string should be kept secret only',
  resave: false,
  saveUninitialized: true,
  cookie: {path: '/', httpOnly: true, secure: false, maxAge: null }
}))

app.use(function(req, res, next) {
  let user_verification = "Not Authorised User";
  if (req.session.AuthCookie) {
    user_verification = "Authorised User";
  }
  console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${user_verification})`);
  next();
});

app.use('/home', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});

app.use('/admindashboard', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error2');
  }
});

app.use('/fastfacts', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});

app.use('/profile', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});


app.use('/createpost', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});

app.use('/createevent', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});

app.use('/createemg', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});

app.use('/createpetition', function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  if(req.session.userId) {
     return next();
  } else {
      res.status(403).redirect('../error');
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});