var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
var logger = require('morgan');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsLetter = require('./routes/API/newsletter');

var app = express();

//env
const environment = process.env.NODE_ENV || 'development';
console.log(`Running in ${environment} mode`);

// Connect to MongoDB 
mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true 
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

  // Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
app.use('/api/newsletter', limiter, newsLetter);


//helmet
const helmet = require("helmet");
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        "default-src": ["'self'"], // Default policy
        "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net", "https://maps.googleapis.com", "https://ajax.googleapis.com"], // Allow scripts from self and necessary CDNs, including Google Maps scripts
        "frame-src": ["'self'", "https://www.google.com", "https://*.googleapis.com"], // Allow embedding Google Maps in <iframe>
        "img-src": ["'self'", "data:", "https://maps.googleapis.com"], // Allow images from Google Maps and self
        "connect-src": ["'self'", "https://*.googleapis.com", "https://*.gstatic.com"], // Allow connections to Google APIs
        "style-src": ["'self'", "https://fonts.googleapis.com"], // Allow styles from Google Fonts
        // Add other directives as necessary
      },
    })
  );

// Basic log format configuration
const customFormat = ':method :url :status :response-time ms - :res[content-length]';
const excludedStatusCodes = new Set(['200', '304', '302', '204']);
// Custom logger to filter out specified response codes
app.use(logger((tokens, req, res) => {
  const statusCode = tokens.status(req, res);
  return !excludedStatusCodes.has(statusCode) ? customFormat : '';
}));

//compression
const compression = require("compression");
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/newsletter', newsLetter);

module.exports = app;
