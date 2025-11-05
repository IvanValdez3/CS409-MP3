//Similar to tasks.js, this file sets up user-related routes
const express = require('express');

// For User we need 5 different actions
const { getUsers, postUsers, getUserId, putUser, deleteUser } = require('../controllers/userController.js');

module.exports = function (router) {
    router.get('/users', getUsers);
    router.post('/users', postUsers);
    router.get('/users/:userId', getUserId);
    router.put('/tasks/:taskId', putTask);
    router.delete('/tasks/:taskId', deleteTask);   
    return router;
}