exports.seed = async function(knex) {
	await knex("users").insert([ 
		{ 
			username: "maryam",
			password: "maryam123" 
		}, 
		{ 
			username: "amin",
			password: "amin123",
		},
		{
			username: "tara",
			password: "tara123"
		}
	])
}