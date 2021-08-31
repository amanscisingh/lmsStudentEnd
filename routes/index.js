const express = require('express');
const indexRoute = express.Router();
const Users = require('../models/Users.js');


indexRoute.get('/', (req, res) => {
    try {
        res.render('login', { layout: 'blank' })
    } catch (error) {
        res.send(error)
    }
});

// /profile
// @GET
indexRoute.get('/profile', async (req, res) => {
    try {
        let email = req.cookies['email'];
        let user = await Users.findOne({ email: email }).lean();
        console.log(email);
        // res.send({user: user})
        res.render('profile', { layout: 'studentLoggedIn', userSchema :user })
    } catch (error) {
        res.send(error);
    }
});

// /profile\
// @PUT
indexRoute.post('/profile', async (req, res) => {
    try {
        let email = req.cookies['email'];
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let phone = req.body.phone;
        let about = req.body.about;

        let user = await Users.findOne({ email: email });

        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.about = about;

        user = await Users.findOneAndUpdate( { _id: user['_id'] },  user, { new: true, runValidators: true } );

        res.redirect('/studentDashboard');
    } catch (error) {
        res.send(error);
    }
});

module.exports = indexRoute;