const router = require("express").Router()
const Users = require("../users/users-model.js")
// import bcryptjs
const bcrypt = require("bcryptjs")

// POST - register user
router.post("/register", async (req, res) => {
	
	payload = {
		username: req.body.username,
		password: req.body.password
	}

	// hash payload.password object
	const hash = bcrypt.hashSync(payload.password, 8)
	// replace the req.body.password value we save to payload object with above hash
	payload.password = hash

	
	try {
		const newUser = await Users.addUser(payload)
		res.status(201).json(newUser)
	} catch (err) {
		res.status(500).json({ message: `problem with db`, error: err })
	}
})

// POST - login
router.post("/login", async (req, res) => {
	const credentials = req.body

	try {
		// use req.body.password to find the user in the db
		const [existingUser] = await Users.findUser(credentials.username)
		// test to see if returns true
		// console.log(bcrypt.compareSync(credentials.password, existingUser.password))
		if (existingUser && bcrypt.compareSync(credentials.password, existingUser.password)) {
			req.session.user = credentials.username;
			// console.log(req.session.user)
			res.status(200).json({ message: `Logged in` });
		} else {
			res.status(401).json({ message: `You shall not pass!` });
		}
	// if the username does not exist or is not returned:
	} catch (err) {
		res.status(500).json({ message: `problem with db`, error: err })
	}

})

// GET - logout

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.send("unable to logout");

		} else {
			res.send("logged out");
		}
	})
})

module.exports = router;