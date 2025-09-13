const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,

    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    age:{
        type: Number,
        min:0
    },
    feedback:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('User', userSchema);