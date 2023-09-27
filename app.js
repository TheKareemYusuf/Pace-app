const express = require("express");
const CONFIG = require("./config/config");
const sessions = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const bodyParser = require("body-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const questionRouter = require("./routes/questionRoutes");
const creatorRouter = require("./routes/creatorRoutes");
const creatorAuthRouter = require("./routes/creatorAuthRoutes");
const inviteRouter = require("./routes/inviteRoutes");
const subjectRouter = require("./routes/subjectRoutes");
const userRouter = require("./routes/userRoutes");
const userActivityRouter = require("./routes/userActivityRoutes");
const userPracticeRouter = require("./routes/userPracticeRoutes");
// const checkAnswerRouter = require("./routes/checkAnswerRoutes");

const userAuthRouter = require("./routes/userAuthRoutes");

const app = express();

const corsOptions = {
  origin: "*",
  // credentials: true, //access-control-allow-credentials:true
  // optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

console.log(app.get("env"));
console.log(process.env.NODE_ENV);

// creating session storage
const sessionStore = new MongoStore({
  mongoUrl: CONFIG.DATABASE_URL,
  collectionName: "sessions",
});

// Middlewares
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: CONFIG.SESSION_SECRET,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

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
app.use("/api/v1/creators/invites", inviteRouter);
app.use("/api/v1/creators/subjects", subjectRouter);
app.use("/api/v1/creators/students", userRouter);

// Students ROUTES
app.use("/api/v1/users/", userAuthRouter);
app.use("/api/v1/users/activity", userActivityRouter);
app.use("/api/v1/users/practice", userPracticeRouter);
// app.use("/api/v1/users/check-answer", checkAnswerRouter);

// unknown routes/endpoints
app.all("*", (req, res, next) => {
  return next(
    new AppError(`unknown route!, ${req.originalUrl}  does not exist`, 404)
  );
});

app.use(globalErrorHandler.errorHandler);

module.exports = app;
