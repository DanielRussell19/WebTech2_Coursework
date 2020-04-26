const express = require('express');
const taskController = express.Router();
const taskDao = require('../Model/task.js');
const userDao = require('../Model/user.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

//View task seperate webpage??? / collected via other means likely

//Add Task
taskController.get('/AddTask/:id', ensureLoggedIn('/Login'), function (request, response) {
    response.render("AddTask", {milestoneid:request.params.id});
})

taskController.post('/AddTask', ensureLoggedIn('/Login'), function (request, response) {
    if(request.body.TaskName == "" || request.body.TaskDesc == "" || request.body.TaskDue == "" || request.body.TaskComplete == ""){
        response.status(400).send("Please fill in the empty fields.");
        return;
    }

    if(request.body.TaskComplete < request.body.TaskDue){
        response.status(400).send("Task can not be complete before due.");
        return;
    }

    taskDao().create(request.body.TaskName, request.body.TaskDesc, request.body.TaskDue,request.body.TaskComplete, request.body.milestoneid);
    response.redirect("HomePage");
});

//Update Task
taskController.get('/UpdateTask:id', ensureLoggedIn('/Login'), function (request, response) {
    const taskId = request.params.id;
    if (taskId == null){
        return response.send(401, "Task ID is not set!");
    }
    response.render("UpdateTask", {taskId});
})

taskController.post('/UpdateTask:id', ensureLoggedIn('/Login'), function (request, response) {
    response.render("UpdateTask");
});

//Remove Task
taskController.get('/RemoveTask:id', ensureLoggedIn('/Login'), function (request, response) {
    const taskId = request.params.id;
    if (taskId == null){
        return response.send(401, "Task ID is not set!");
    }
    response.render("RemoveTask", {taskId});
})

taskController.post('/RemoveTask:id', ensureLoggedIn('/Login'), function (request, response) {
    response.render("RemoveTask");
});

module.exports = taskController;