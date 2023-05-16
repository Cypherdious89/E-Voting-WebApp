const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        username : {type: String, required: true},
        email : {type: String, required: true},
        password : {type: String, required: true},
        mobileNumber : {type: Number, required: true},
        age : {type: Number, required: true},
        uid : {type: String, required: true, unique: true},
        walletAddress : {type: String, default: "", required: true, unique: true}
    }, 
    {collection: 'user-data'}
)

const model = mongoose.model('UserData', User);

module.exports = model;
