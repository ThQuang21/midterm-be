const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	name:  {
        required: true,
        type: String
	},
	email: {
        required: true,
        type: String
	},
    age:  {
        required: true,
        type: Number
	},
    status: String,
    job:  {
        required: true,
        type: String
	},
    phone:  {
        required: true,
        type: String
	},
    password: {
        required: true,
        type: String
    }
})

module.exports = mongoose.model('User', dataSchema)