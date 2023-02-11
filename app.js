const express = require("express");
const bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const questionRouter = require("./routes/questionRoutes");
const creatorRouter = require("./routes/creatorRoutes");
const creatorAuthRouter = require("./routes/creatorAuthRoutes");
const inviteRouter = require('./routes/inviteRoutes');

const app = express();


console.log(app.get('env'));
console.log(process.env.NODE_ENV);

// Middlewares

// Middleware to parse user information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Requiring authentication middleware
require("./authentication/creatorAuth");

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
app.use("/api/v1/invites", inviteRouter)

// unknown routes/endpoints
app.all("*", (req, res, next) => {
  return next(new AppError(`unknown route!, ${req.originalUrl}  does not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
