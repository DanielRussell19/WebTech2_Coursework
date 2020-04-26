const express = require('express');
const projectController = express.Router();
const taskDao = require('../Model/task.js');
const userDao = require('../Model/user.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

//View task seperate webpage??? / collected via other means likely

//Add Task
projectController.get('/AddTask', ensureLoggedIn('/Login'), function (request, response) {

})

projectController.post('/AddTask', ensureLoggedIn('/Login'), function (request, response) {

});

//Update Task
projectController.get('/UpdateTask', ensureLoggedIn('/Login'), function (request, response) {

})

projectController.post('/UpdateTask', ensureLoggedIn('/Login'), function (request, response) {

});

//Remove Task
projectController.get('/RemoveTask', ensureLoggedIn('/Login'), function (request, response) {

})

projectController.post('/RemoveTask', ensureLoggedIn('/Login'), function (request, response) {

});

module.exports = taskController;