const express = require('express');
const taskController = express.Router();
const taskDao = require('../Model/task.js');
const userDao = require('../Model/user.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

//View task seperate webpage??? / collected via other means likely

//Add Task
taskController.get('/AddTask/:id', ensureLoggedIn('/Login'), function (request, response) {
    response.render("AddTask", {taskid:request.params.id});
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

    taskDao().create(request.body.TaskName, request.body.TaskDesc, request.body.TaskDue,request.body.TaskComplete, request.body.taskid);
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

//Remove task
taskController.get('/Removetask/:id', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the task id
    const taskId = request.params.id;
    if (taskId == null) 
        return response.send(401, "task ID is not set!");

    response.render("Removetask", {taskId});
})

taskController.post('/Removetask/:id', function (request, response) {
    // Get the task id
    const taskId = request.params.id;
    if (taskId == null) 
        return response.send(401, "task ID is not set!");

    taskDao().deletetaskId(taskId);
    return response.redirect('/');
})

module.exports = taskController;