const mongoose = reuire('mongoose');

const User = new mongoose.Schema(
    {
        username : {type: String, required: true},
        email : {type: String, required: true, unique: true},
        password : {type: String, required: true},
        mobileNumber : {type: Number, required: true},
        aadhar : {type: Number, required: true},
        uid : {type: String, required: true},
    }, 
    {collection: 'user-data'}
)

const model = mongoose.model('UserData', User);

module.exports = model;
