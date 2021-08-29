const express = require('express');
const studentDashboardRoute = express.Router();
const Classes = require('../models/Classes.js');
const Users = require('../models/Users.js');


// /studentDashboard
studentDashboardRoute.get('/', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const student = await Users.findOne({ email: req.cookies['email'] }).lean();
        let allClassDetails = [];
        let classCodes = student.classCodes
        for (let i = 0; i < classCodes.length; i++) {
            let x = await Classes.findOne({ classCode: classCodes[i] }).lean();
            allClassDetails.push(x);  
        }
        console.log(allClassDetails);

        res.render('studentDashboard', { layout: 'studentLoggedIn', allClasses: allClassDetails  });
    } catch (error) {
        res.send(error);
    }
})


// /studentDashboard/join
studentDashboardRoute.get('/join', (req, res) => {
    try {
        // passing all the class details in form of array to the template
        res.render('joinClass', { layout: 'studentLoggedIn' });
    } catch (error) {
        res.send(error);
    }
})

// /studentDashboard/:classCode
studentDashboardRoute.get('/:classCode', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const classCode = req.params.classCode;
        let classData = await Classes.findOne({ classCode: classCode }).lean();
        console.log(classData);

        res.render('classDashboard', { layout: 'singleClass', classData: classData , classCode: classCode });
    } catch (error) {
        res.send(error);
    }
});


// /studentDashboard/join
// @POST request to join an class
studentDashboardRoute.post('/join', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const classCode = req.body.classCode;
        const student = await Users.findOne({ email: req.cookies['email'] });
        const classInfo = await Classes.findOne({ classCode: classCode });
        console.log(classInfo.classStudents);
        if (student.classCodes.includes(classCode)) {
            console.log('Student has already joined the class!!!');
            res.redirect('/studentDashboard');
        } else {
            student.classCodes.push(classCode);
            classInfo.classStudents.push(req.cookies['email']);
            await classInfo.save();
            await student.save();
            console.log(student.classCodes);
            console.log(classInfo.classStudents);
            res.redirect('/studentDashboard');

        }
        
    } catch (error) {
        res.send(error);
    }
})
module.exports = studentDashboardRoute;