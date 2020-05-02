const express = require('express');
const shareController = express.Router();
const userDao = require('../Model/user.js');
const projectDao = require('../Model/project.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

shareController.get("/ShareProject", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    response.render("ShareProject");
});

shareController.post("/ShareProject", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }
    console.log(request.body.projectidshare);

    var shareid = request.body.projectidshare;

    const dao = projectDao();
    dao.lookupbyShareLink(shareid, (err, project) => {
        if (project) {
            console.log(project);
            response.redirect("/ViewProject/" + project._id);
        } else {
            return response.send(401, "Project does not exist");
        }
    }); 
});

module.exports = shareController;