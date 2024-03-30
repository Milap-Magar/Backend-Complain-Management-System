const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const database = require("./database");
const dotenv = require("dotenv");
dotenv.config();

const sessionStore = new MySQLStore(
  {
    expiration: process.env.SESSION_EXPIRES * 1000 * 60 * 60,
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires_at",
        data: "data",
      },
    },
  },
  database.pool
);

module.exports = session({
  key: process.env.SESSION_KEY,
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
});