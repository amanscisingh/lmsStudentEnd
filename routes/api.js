const express  = require('express');
const apiRoute = express.Router();
const Users = require('../models/Users.js');

// /api:email
apiRoute.get('/:email', async (req, res) => {
    try {
        let email = req.params.email;
        const user = await Users.findOne({ email: email });
        if (user == null) {
            res.send({status: "failed"});
        } else {
            // 2 possibility either login with google or custom login
            if (user['googleId']) {
                res.send({status: "success", isGoogle: true});
            } else {
                res.send({status: "success", isGoogle: false});
            }
        }

    } catch (error) {
        res.send(error);
    }
});

module.exports = apiRoute;