const events = {
	findAll: function(req, res, next){
		res.json('getAll');
	},
	findOne: function(req,res){
		res.json('getOne');
	},
	create: function(req,res){
		res.json('create');
	},
	update: function(req, res){
		res.json('update');
	},
	delete: function(req,res){
		res.json('delete');
	}
}

module.exports = events;