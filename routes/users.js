const users = {
	findAll: function(req,res, next){
		res.json('findAll');
	},
	findOne: function(req,res){
		res.json('findOne');
	},
	create: function(req,res){
		res.json('create');
	},
	update: function(req,res){
		res.json('update');
	},
	delete: function(req,res){
		res.json('delete');
	}
}

module.exports = users;