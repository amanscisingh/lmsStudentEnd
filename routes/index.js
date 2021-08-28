const express = require('express');
const indexRoute = express.Router();


indexRoute.get('/', (req, res) => {
    try {
        res.render('login', { layout: 'blank' })
    } catch (error) {
        res.send(error)
    }
})

module.exports = indexRoute;