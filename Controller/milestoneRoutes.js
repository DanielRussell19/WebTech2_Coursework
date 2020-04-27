const express = require('express');
const milestoneController = express.Router();
const milestoneDao = require('../Model/milestone.js');
const userDao = require('../Model/user.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

//View milestone seperate webpage??? / collected via other means likely

//Add milestone
milestoneController.get('/Addmilestone/:id', ensureLoggedIn('/Login'), function (request, response) {
    response.render("AddMilestone", {projectid:request.params.id});
})

milestoneController.post('/Addmilestone', ensureLoggedIn('/Login'), function (request, response) {
    if(request.body.milestoneName == "" || request.body.description == "" || request.body.dueDate == "" || request.body.completionDate == ""){
        response.status(400).send("Please fill in the empty fields.");
        return;
    }

    if(request.body.completionDate < request.body.dueDate){
        response.status(400).send("milestone can not be complete before due.");
        return;
    }

    milestoneDao().create(request.body.milestoneName, request.body.description, request.body.dueDate,request.body.completionDate, request.body.projectid);
    response.redirect("HomePage");
});

//Update milestone
milestoneController.get('/Updatemilestone:id', ensureLoggedIn('/Login'), function (request, response) {
    const milestoneId = request.params.id;
    if (milestoneId == null){
        return response.send(401, "milestone ID is not set!");
    }
    response.render("UpdateMilestone", {milestoneId});
})

milestoneController.post('/Updatemilestone:id', ensureLoggedIn('/Login'), function (request, response) {
    response.render("Homepage");
});

//Remove milestone
milestoneController.get('/Removemilestone/:id', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the milestone id
    const milestoneId = request.params.id;
    if (milestoneId == null) 
        return response.send(401, "milestone ID is not set!");

    response.render("Removemilestone", {milestoneId});
})

milestoneController.post('/Removemilestone/:id', function (request, response) {
    // Get the milestone id
    const milestoneId = request.params.id;
    if (milestoneId == null) 
        return response.send(401, "milestone ID is not set!");

    milestoneDao().deletemilestoneId(milestoneId);
    return response.redirect('/');
})

module.exports = milestoneController;