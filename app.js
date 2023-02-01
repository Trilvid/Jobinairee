const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const user = require("./routes/userRoute");
const auth = require("./routes/authRoute");
const employer = require("./routes/employerRoute");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });

  // view engine
app.set('view engine', 'ejs');

// routes
app.get('/', (req, res) => res.render('home'));
app.use('/api/v1/users', user);
app.use('/api/auth', auth);
app.use('/api/v1/post-a-job', employer);

module.exports = app;
