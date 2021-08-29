const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    classCode: {
        type: String,
        required: true
    },
    profEmail : {
        type: String,
        required: true
    },
    fileUploadName: {
        type: String,
        required: true
    },
    type: {  // assignment or test
        type: String,
        required: true,
        default: 'assignment'
    },
    allSubmissions: [
        {
            studentInfo:{
                studentEmail: {  // unique email of student
                    type: String,
                    required: true
                },
                studentName: { // name of student
                    type: String,
                    required: true
                },
            },
            submission: {
                originalFileName: {
                    type: String,
                    required: true
                },
                uploadedFileName: {
                    type: String,
                    required: true
                },
                marksAssigned: {
                    type: Number,
                    required: true,
                    default: -1
                },
                submissionTime: {
                    type: Date,
                    default: Date.now
                }                
            },
         }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('allAssignments', assignmentSchema);