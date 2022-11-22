const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: String,
	password: String
})

UserSchema.methods.comparePassword = function(password) {
	return password === this.password
}

UserSchema.methods.generateJWT = function() {
	let payload = {
		id: this._id,
		username: this.username
	}
	return jwt.sign(payload, 'secret_key', {
		expiresIn: '24h'
	})
}

const User = mongoose.model('User', UserSchema)
module.exports = User
