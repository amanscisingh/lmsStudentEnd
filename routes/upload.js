const express = require('express');
const updateRoute = express.Router();


// @POST
// /upload
updateRoute.post('/', (req, res) => {
    try {
        console.log('post request received');
        res.send({ file: req.file });
    } catch (error) {
        res.send(error);
    }
});


module.exports = updateRoute;



