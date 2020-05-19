db = require("../database/dbConfig.js");

function getUsers() {
	return db("users")
}

async function addUser(user) {
	try {
		const [id] = await db("users").insert(user)
		return db("users").where("id", id).first()
	} catch (err) {
		console.log(err)
	}
}

function findUser(username) {
	return db("users").where("username", username);
}

module.exports = {
	getUsers,
	addUser,
	findUser
}