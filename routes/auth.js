const jwt = require('jwt-simple');
const secret = require('../config/secret.js')();

const auth =  {
	login : function(req,res){
		const username = req.body.username || '';
		const password = req.body.password || ''; 
		console.log('password',password);
		console.log('username',username);
		if (username == '' || password == '') {
			res.status(401).json({'status':401, 'message': 'Invalid credentials'});
			return;
		}

		// dummy DB query check

		dbUserObj = auth.validateDB(username,password);

		if (!dbUserObj){
			res.status(401).json({'status':401,'message':'Invalid credentials'});
			return;
		}

		if (dbUserObj){
			res.json(generateToken(dbUserObj));
		}

	},

	validateDB : function(username, password) {
		return userDB;
	},
	validateDBUser : function(username) {
		return userDB;
	}
}

function generateToken(user){
	const expires = expiresIn(7);
	const token = jwt.encode({
		exp : expires,
		u : user['username']
	}, secret);
	return {
		expires,
		user,
		token
	}
}

function expiresIn(days){
	var dateObj = new Date();
	return dateObj.setDate( dateObj.getDate() + days);
}

// Faking a User DB
const userDB = {
	username : 'nicolas2bert',
	name: 'Nicolas HUMBERT',
	role: 'admin'
}

module.exports = auth;