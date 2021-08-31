const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    googleId: {
        type: String, //payload['sub']
        required: false,
    },
    firstName: { 
        type: String, //givenName
        required: true,
    },
    lastName: {
        type: String, //familyName
    },
    phone: {
        type: Number,
        required : false,
    },
    about : {
        type: String,
        required : false,
    },
    image: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    designation: {
        type: String,  //teacher or student
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    classCodes: [ // array of strings
        {
            type: String,
            required: false,
        }
    ],

}, { collections: 'allUsers' });

module.exports = mongoose.model('User', userSchema);