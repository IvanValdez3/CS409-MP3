//Similar to tasks.js, this file sets up user-related routes
const express = require('express');

// For User we need 5 different actions
const { getUsers, postUser, getTaskId, putUser, deleteUser } = require('../controllers/userController.js');

module.exports = function (router) {
    router.get('/users', getUsers);
    router.post('/users', postUser);
    router.get('/users/:userId', getTaskId);
    router.put('/users/:userId', putUser);
    router.delete('/users/:userId', deleteUser);   
    return router;
}