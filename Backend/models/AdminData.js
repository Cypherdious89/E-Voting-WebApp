const mongoose = require('mongoose');

const Admin = new mongoose.Schema(
    {
        name : {type: String, required: true},
        email : {type: String, required: true, unique: true},
        roles: {type: Array, required: true},
        password : {type: String, required: true},
        mobileNo : {type: Number, required: true},
        walletAddress : {type: String},
    },
    {collection: 'admin-data'}
)

const model = mongoose.model('AdminData', Admin);

module.exports = model;