// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var TasksSchema = new mongoose.Schema({
    name: String,
    description: String,
    deadline: Date,
    completed: { type: Boolean, default: false },
    assignedUser: { type: String, default: "" },
    assignedUserName: { type: String, default: "unassigned" },
    dateCreated: { type: Date, default: Date.now }
    //Date should be automatically set by server when created
});

// Export the Mongoose model
module.exports = mongoose.model('Tasks', TasksSchema);