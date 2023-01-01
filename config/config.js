require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV 
};
