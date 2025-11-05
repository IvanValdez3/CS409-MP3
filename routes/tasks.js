// The task route should handle all endpoints related to tasks
const express = require('express');

// For Task we need 5 different actions
const { getTasks, postTask, getTaskId, putTask, deleteTask } = require('../controllers/tasksController.js');

module.exports = function (router) {
    router.get('/tasks', getTasks);
    router.post('/tasks', postTask);
    router.get('/tasks/:taskId', getTaskId);
    router.put('/tasks/:taskId', putTask);
    router.delete('/tasks/:taskId', deleteTask);   
    return router;
}