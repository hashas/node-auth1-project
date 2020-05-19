const router = require("express").Router()

const Users = require("./users-model.js")

// import restricted middleware
const restricted = require("../auth/restricted-middleware.js")

// GET - get all users
router.get("/users", restricted, (req, res) => { // async
	// try {
	// 	const allUsers = await Users.getUsers()
	// 	res.status(201).json(allUsers)
	// } catch (err) {
	// 	res.send(err)
	// }

	Users.getUsers()
		.then(users => {
			res.json(users);
		})
		.catch(err => res.send(err));
})


module.exports = router;