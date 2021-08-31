const express = require('express');
const authRoute = express.Router();
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.CLIENT_ID.toString();
const client = new OAuth2Client(CLIENT_ID);
const User = require('../models/Users.js');

// /auth/login
authRoute.post('/login', (req, res)=> {
    try {
        let token = req.body.token;
        let userid;
        let email;
        let image;

        async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID, 
            });
            const payload = ticket.getPayload();
            userid = payload['sub'];
            email = payload['email'];
            image = payload['picture'];
            let userData = await User.findOne({googleId: userid});
            console.log(payload);
            if (userData == null) {
                // create a new User
                console.log('userNot Found');

                let newUser = new User({
                    googleId: userid,
                    firstName: payload.given_name,
                    lastName: payload.family_name,
                    image : payload.picture,
                    email: payload.email,
                    designation: 'student',
                });

                await newUser.save();
                console.log('data updated in Users db');
            }

        }
    
        verify()
        .then(()=> {
            // Storing token and googleId in the cookie storage
            res.cookie('session-cookie', token);
            res.cookie('userid', userid);
            res.cookie('email', email);
            res.cookie('image', image);
            res.send("success");
        })
        .catch(console.error);
    } catch (error) {
        res.send(error);
    }
})

// /customSignup
authRoute.post('/customSignup', async (req, res)=> {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let newUser = new User({
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName,
            designation: 'student',
        });

        if (password === confirmPassword) {
            await newUser.save();
            res.cookie('email', email);
            res.redirect('/studentDashboard');
        }
        else {
            res.send('password mismatch');
        }

    } catch (error) {
        res.send(error);
    }
});

// /customLogin
authRoute.post('/customLogin', async (req, res)=> {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let userData = await User.findOne({email: email});
        if (userData) {
            if (userData.password === password) {
                res.cookie('email', email);
                res.redirect('/studentDashboard');
            }
            else {
                res.send('password mismatch');
            }
        }
        else {
            res.send('user not found');
        }
    } catch (error) {
        res.send(error);
    }
});

module.exports = authRoute;