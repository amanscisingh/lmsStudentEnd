const mongooose = require('mongoose');

const ScheduledClassesSchema = new mongooose.Schema({
    classCode: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: { //in hours
        type: Number,
        required: true
    },
    classTeacherEmail : {
        type: String,
        required: true
    },
    classLink: {
        type: String,
        required: true
    },
    classPassword: {  // passwords in meeting is secured
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongooose.model('ScheduledClasses', ScheduledClassesSchema);