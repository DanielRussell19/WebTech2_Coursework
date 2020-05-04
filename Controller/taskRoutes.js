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
taskController.get('/Updatetask/:id', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the project id
    const taskId = request.params.id;
    if (taskId == null) 
        return response.send(401, "task ID is not set!");

    const dao = taskDao();
    dao.lookupId(taskId, (err, task) => {
        if (task) {
            console.log(task);
            response.render("UpdateTask", {task});
        } else {
            return response.send(401, "Task does not exist");
        }
    });

})

taskController.post("/UpdateTask/:id", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the project id
    const taskId = request.params.id;
    if (taskId == null) 
        return response.send(401, "task ID is not set!");

    const taskName = request.body.TaskName;
    const description = request.body.TaskDesc;
    const dueDate = request.body.TaskDue;
    const completionDate = request.body.TaskComplete;
    const milestoneid = request.body.milestoneId;

    taskDao().lookupId(taskId, (err, task) => {
        if (task) {
            // Update the project
            taskDao().updateTask(taskId, taskName, description, dueDate, completionDate, milestoneid,
                (noReplaced) => {
                    return response.send(401, 
                        "Successfully changed task! Please return to the <a href=\"/\">Home Page</a>.");
                },
                (err) => {
                    console.error("Error during database update! ", err);
                    return response.send(500, "Error during database update!");
                });
            return;
        } else {
            return response.send(401, "task does not exist");
        }
    });
})

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