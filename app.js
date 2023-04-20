const express = require("express");
const bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const questionRouter = require("./routes/questionRoutes");
const creatorRouter = require("./routes/creatorRoutes");
const creatorAuthRouter = require("./routes/creatorAuthRoutes");
const inviteRouter = require('./routes/inviteRoutes');
const subjectRouter = require('./routes/subjectRoutes');
const userRouter = require('./routes/userRoutes');


const userAuthRouter = require("./routes/userAuthRoutes");


const app = express();


console.log(app.get('env'));
console.log(process.env.NODE_ENV);

// Middlewares

// Middleware to parse user information
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Creator authentication middleware
require("./authentication/creatorAuth");

// User authentication middleware
require("./authentication/userAuth");

// Landing page routes
app.get("/", (req, res) => {
  res.json({
    status: "Success",
    message:
      "Welcome to PACE APP API, kindly visit the following links for information about usage",
    Documentation_link: "Link to documentations will go here",
  });
});

// Admin and creator ROUTES
app.use("/api/v1/creators/", creatorAuthRouter);
app.use("/api/v1/creators/creators", creatorRouter);
app.use("/api/v1/creators/questions", questionRouter);
app.use("/api/v1/creators/invites", inviteRouter)
app.use("/api/v1/creators/subjects", subjectRouter);
app.use("/api/v1/creators/students", userRouter);


// Students ROUTES 
app.use("/api/v1/users/", userAuthRouter)

// unknown routes/endpoints
app.all("*", (req, res, next) => {
  return next(new AppError(`unknown route!, ${req.originalUrl}  does not exist`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
