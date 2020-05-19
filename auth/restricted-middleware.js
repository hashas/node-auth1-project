// check if session object exists and 'user' property has been populated
// i.e. on successful login this session object would've been populated 
// by our middleware with the session id that's currently in memory

module.exports = (req, res, next) => {
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).json({ message: `You shall not pass!` });
	}
}