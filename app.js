const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
mongoose.Promise = global.Promise;
//connect to the database
mongoose.connect('mongodb://localhost/restshop');

//Initialize express and save it in a constant called app
const app = express();

//Middlewares
app.use(morgan('dev'));  //morgan is used to log to the console
//makes the static folder public
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

//set up the 3 routes of order, product and user
// app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/products', require('./routes/products'));


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
module.exports=app;