const mongoose = require('mongoose');

const allClasses = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    classCode: {    
        type: String,
        required: true
    },
    classDescription: {
        type: String,
        required: true
    },
    classTeacher: {
        type: String,
        required: true
    },
    classTeacherEmail : {
        type: String,
        required: true
    },
    classTeacherImage: {
        type: String,
        required: false
    },
    classStudents: [  // storing the emails of students
        {
            type: String,
            required: true
        }
    ]
}, { collection: 'allClasses' });

module.exports = mongoose.model('allClasses', allClasses);