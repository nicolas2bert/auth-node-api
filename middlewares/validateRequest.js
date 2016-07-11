const jwt = require('jwt-simple');
const secret = require('../config/secret')();
const validateDBUser = require('../routes/auth.js').validateDBUser;

module.exports =  function(req,res,next){
	const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.get('x-access-token');
	//const key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.get('x-key');
	if (token){
		try {
			console.log('secret',secret);
			const decoded = jwt.decode(token,secret);
			console.log('decoded',decoded);
			if (decoded.exp < Date.now){
				res.status(400).json({'status':400, 'message':'Token expired'});
				return;
			}
			// key == username
			console.log('decoded.u',decoded.u);
			const user = validateDBUser(decoded.u);
			if (user) {
				console.log("req.originalUrl",req.originalUrl);
				console.log("req.originalUrl.indexOf('admin')",req.originalUrl.indexOf('admin'));
				if ( (req.originalUrl.indexOf('admin') >= 0 && user.role == 'admin') || (req.originalUrl.indexOf('admin') < 0) ){
					//Go to the next middleware
					console.log('user',user);
					next();
				}else{
				 res.status(403).json({'status':403, 'message':'No authorized'});
				 return;
				}
			}else{
				res.status(401).json({'status':401, 'message':'Invalid decode.u'});
				return;
			}

		}catch(err){
			res.status(500).json({'status':500, 'message':'Something wrong happened'});
		}
	}else{
		res.status(401).json({'status':401, 'message':'Invalid token or key'})
	}
}