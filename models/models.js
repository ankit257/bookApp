var mongoose = require('mongoose');
// var UserSchema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
	id : string,
	loc : {type : [Number], index : "2dsphere"},
	library : [{
		id : String,
		name : String,
		author : String,
		image : String,
		genre : String,
		status : Boolean,

	}],
	updated : Date.now,
	created : Date
});
UserSchema.methods.findNearBy = function (coordinates, maxDistance){
	return this.model('Users').find({loc : {
			$near : {
					$geometry : {
							type: "Point",
							coordinates : coordinates
						},
						$maxDistance : maxDistance 
					}
				}
		})
}
module.exports = mongoose.model('User', UserSchema);