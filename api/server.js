const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// import sessions management module
const session = require("express-session");
// get knex session store instance and pass session object to configure
// knexSessionStore object for storing sessions to database
const knexSessionStore = require("connect-session-knex")(session);

// import user-router.js
const userRouter = require("../users/users-router.js");
// import auth-router.js
const authRouter = require("../auth/auth-router.js");


const server = express();

// create session config object that we'll pass into session object that
// we get from express-session
const sessionConfig = {
	name: "chocolate-chip",
	secret: "thesecretsauce",
	cookie: {
		maxAge: 3600 * 1000,
		// using http (not https) only for this application for simplicity, should be true
		// in production
		secure: false,
		// provides access only to the server that created the cookie rather
		// than have javascript application have access to it
		httpOnly: true,
	},
	// when it comes to storing info in db this is good to set to false
	resave: false,
	// whether it can save a cookie before it gets user permission e.g. GDPR
	saveUninitialized: false,
	// create a new object for our knexSessionStore that we get from "require" and pass in
	// configuration object to specify how we connect to database
	store: new knexSessionStore(
		{
			// bring in db config which contains configured instance of knex from knexfile.js
			// which contains location of db amongst other things
			knex: require("../database/dbConfig.js"),
			// specify which table will contain our session data
			tablename: "sessions",
			// specify the name of the column in that table that will contain session id's
			sidfieldname: "sid", // (sid short for session id)
			// this parameter tells system to create the tabel if it doesn't already exist
			createtable: true,
			// this property will specify how often to remove sessions from db that have expired
			clearInterval: 3600 * 1000, // once per hour
		}
	)
}

// global middleware stack
server.use(helmet());
server.use(express.json());
server.use(cors());

// this will add session object to every request, which will contain info about the session,
// either prepopulated with session info (assuming the user has the cookie with valid id) e.g.
// GET request after successful login OR brand new session object w/o valid session info until
// we populate it and then it will be stored in the session store
server.use(session(sessionConfig));

server.use("/api", userRouter);
server.use("/api", authRouter);

server.get("/", (req, res) => {
	res.json({api: "up"});
});

module.exports = server;