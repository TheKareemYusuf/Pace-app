const express = require("express");
const bodyParser = require("body-parser");
const questionRouter = require("./routes/questionRoutes");
const creatorRouter = require("./routes/creatorRoutes");
const creatorAuthRouter = require('./routes/creatorAuthRoutes');


const app = express();

// Middlewares


// Middleware to parse user information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Requiring authentication middleware
require('./authentication/creatorAuth')


// Landing page routes
app.get("/", (req, res) => {
  res.json({
    status: "Success",
    message:
      "Welcome to PACE APP API, kindly visit the following links for information about usage",
    Documentation_link: "Link to documentations will go here",
  });
});

// ROUTES
app.use("/api/v1/", creatorAuthRouter);
app.use("/api/v1/creators", creatorRouter);
app.use("/api/v1/questions", questionRouter);


module.exports = app;
