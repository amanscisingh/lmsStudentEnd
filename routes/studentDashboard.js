const express = require('express');
const studentDashboardRoute = express.Router();
const Classes = require('../models/Classes.js');
const Users = require('../models/Users.js');
const Assignments = require('../models/Assignments.js');
const mongoose =   require('mongoose');
const ScheduledClasses= require('../models/ScheduledClasses.js')


// /studentDashboard
studentDashboardRoute.get('/', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const student = await Users.findOne({ email: req.cookies['email'] }).lean();
        let allClassDetails = [];
        let classCodes = student.classCodes;
        for (let i = 0; i < classCodes.length; i++) {
            let x = await Classes.findOne({ classCode: classCodes[i] }).lean();
            allClassDetails.push(x);  
        }
        let allScheduledClasses = await ScheduledClasses.find({ classCode: { $in : classCodes } }).lean();

        res.render('studentDashboard', { layout: 'studentLoggedIn', allClasses: allClassDetails ,allScheduledClasses: allScheduledClasses });
    } catch (error) {
        res.send(error);
    }
})


// /studentDashboard/join
studentDashboardRoute.get('/join', (req, res) => {
    try {
        // passing all the class details in form of array to the template
        res.render('joinClass', { layout: 'blank' });
    } catch (error) {
        res.send(error);
    }
})

// /studentDashboard/:classCode
studentDashboardRoute.get('/:classCode', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        let studentEmail = req.cookies['email'];
        let classCode = req.params.classCode;
        let classData = await Classes.findOne({ classCode: classCode }).lean();
        let allAssignmentsandTests = await Assignments.find({ classCode: classCode }).lean();
        let allAssignments = []
        let allTests = []
        let allScheduledClasses = await ScheduledClasses.find({ classCode: classCode }).lean();
        for (let i = 0; i < allAssignmentsandTests.length; i++) {
            let ind = -1;

            for (let j = 0; j < allAssignmentsandTests[i].allSubmissions.length; j++) {
                let allSub = allAssignmentsandTests[i].allSubmissions[j];
                if (allSub.studentInfo.studentEmail === studentEmail) {
                    ind = j;
                    break;
                }
            }
            
            
            let temp
            if (ind !== -1) {
                temp = {
                    marks: allAssignmentsandTests[i].allSubmissions[ind].submission.marksAssigned,
                    isSubmitted:allAssignmentsandTests[i].allSubmissions[ind].submission.submissionTime
                };
            } else {
                temp = {
                    marks: "NA",
                    isSubmitted: "NA"
                };
            }

            if (allAssignmentsandTests[i].type == 'assignment') {
                allAssignments.push({...allAssignmentsandTests[i], ...temp});
            } else {
                allTests.push({...allAssignmentsandTests[i], ...temp});   
            }
        };

        res.render('classDashboard', { layout: 'singleClass', classData: classData , classCode: classCode, allAssignments, allTests, allScheduledClasses });
    } catch (error) {
        res.send(error);
    }
});


studentDashboardRoute.get('/:classCode/test', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        let studentEmail = req.cookies['email'];
        let classCode = req.params.classCode;
        let classData = await Classes.findOne({ classCode: classCode }).lean();
        let allAssignmentsandTests = await Assignments.find({ classCode: classCode }).lean();
        let allAssignments = []
        let allTests = []
        let marksAssignedAssignment = []
        let marksAssignedTest = []
        let allScheduledClasses = await ScheduledClasses.find({ classCode: classCode }).lean();
        for (let i = 0; i < allAssignmentsandTests.length; i++) {
            let ind = -1;

            for (let j = 0; j < allAssignmentsandTests[i].allSubmissions.length; j++) {
                let allSub = allAssignmentsandTests[i].allSubmissions[j];
                if (allSub.studentInfo.studentEmail === studentEmail) {
                    ind = j;
                    break;
                }
            }
            
            
            let temp
            if (ind !== -1) {
                temp = {
                    marks: allAssignmentsandTests[i].allSubmissions[ind].submission.marksAssigned,
                    isSubmitted: allAssignmentsandTests[i].allSubmissions[ind].submission.submissionTime
                };
            } else {
                temp = {
                    marks: "NA",
                    isSubmitted: "NA"
                };
            }

            if (allAssignmentsandTests[i].type == 'assignment') {
                allAssignments.push({...allAssignmentsandTests[i], ...temp});
            } else {
                allTests.push({...allAssignmentsandTests[i], ...temp});   
            }
        };

        res.send(allAssignments);
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


// /studentDashboard/:classCode/assignment/:assignmentId
studentDashboardRoute.get('/:classCode/assignment/:assignmentId', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        console.log(req.query);
        let marks = req.query.marks;
        let isSubmitted = req.query.isSubmitted;
        let hasUploaded = false;
        let studentEmail = req.cookies['email'];
        let uploadedAssignmentfile = '';
        const classCode = req.params.classCode;
        const assignmentId = req.params.assignmentId;
        let assignmentData = await Assignments.findById(mongoose.Types.ObjectId(assignmentId)).lean();
        let allSubmissions = assignmentData.allSubmissions;

        for (let i = 0; i < allSubmissions.length; i++) {
            if (allSubmissions[i].studentInfo.studentEmail == studentEmail) {
                hasUploaded = true;
                uploadedAssignmentfile = allSubmissions[i].submission[1];
            }
        }

        res.render('assignmentDashboard', {
             layout: 'studentLoggedIn',  
             classCode: classCode, 
             assignmentData, 
             hasUploaded, 
             uploadedAssignmentfile,
             marks,
             isSubmitted 
        });
    } catch (error) {
        res.send(error);
    }
});


// /:classCode/assignment/:assignmentId
// @POST
studentDashboardRoute.post('/:classCode/assignment/:assignmentId/:uploadedFileName', async (req, res) => {
    try {
        // passing all the class details in form of array to the template
        const uploadedFileName = req.params.uploadedFileName;
        const classCode = req.params.classCode;
        const assignmentId = req.params.assignmentId;
        const studentEmail = req.cookies['email'];
        const studentData = await Users.findOne({ email: studentEmail });
        const assignmentData = await Assignments.findById(mongoose.Types.ObjectId(assignmentId)).lean();
        const allSubmissions = assignmentData.allSubmissions;
        let submission = {
            studentInfo: {
                studentName: studentData.firstName,
                studentEmail: studentEmail
            },
            submission: {
                originalFileName: req.body.file,
                uploadedFileName: uploadedFileName
            }
        }
        allSubmissions.push(submission);
        assignmentData.allSubmissions = allSubmissions;
        // update assignmentData
        await Assignments.findByIdAndUpdate(mongoose.Types.ObjectId(assignmentId), assignmentData, { new: true }); 
        res.redirect('/studentDashboard/' + classCode);
    } catch (error) {
        console.error(error);
        res.send(error);
    }
});


module.exports = studentDashboardRoute;