const express = require('express');
const projectController = express.Router();
const projectDao = require('../Model/project.js');
const userDao = require('../Model/user.js');
const auth = require('../auth/auth.js');
const { ensureLoggedIn } = require('connect-ensure-login');

projectController.get("/Homepage", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    projectDao()
        .getAllEntries()
        .then((list) => {
            console.log(list);
            response.render("HomePage", {
                entries: list
            });
        })
        .catch((err) => {
            console.log('Error: ')
            console.log(JSON.stringify(err))
        });
});

projectController.get('/AddProject', ensureLoggedIn('/Login'), function (request, response) {
    // Check if the user is logged in (not working)
    if (request.user == null) { response.redirect('/'); return; }

    response.render("AddProject", {
        'user': request.user.user
    });
})

projectController.post('/AddProject', ensureLoggedIn('/Login'), function (request, response) {
    /*// Check if the user is logged in (not working)
   if (request.user == null) { response.redirect('/'); return; }*/

    if (!request.body.projectTitle || !request.body.modulename || !request.body.description ||
        !request.body.dueDate || !request.body.completionDate) {
        response.status(400).send("Please fill in the empty fields.");
        return;
    }

    projectDao().create(request.body.projectTitle, request.body.modulename, request.body.description,
        request.body.isPrivate !== undefined, request.body.dueDate, request.body.completionDate);
    response.redirect("/HomePage");
});

projectController.get('/RemoveProject', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    response.render("RemoveProject");
})

projectController.post('/RemoveProject', function (request, response) {
    projectDao().deleteProject(request.body.deleteProject);
    response.redirect('HomePage');
})

projectController.get('/UpdateProject', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    response.render("UpdateProject");
})

projectController.post("/UpdateProject", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    const oldprojectTitle = request.body.oldprojectTitle;
    const projectTitle = request.body.projectTitle;
    const modulename = request.body.modulename;
    const description = request.body.description;
    //const isPrivate = request.body.isPrivate;
    const dueDate = request.body.dueDate;
    const completionDate = request.body.completionDate;

    console.log("Old title: ", oldprojectTitle);
    console.log("New title: ", projectTitle);
    console.log("New module name: ", modulename);
    console.log("New description: ", description);
    console.log("New due date: ", dueDate);
    console.log("New completion date: ", completionDate);

    if (!oldprojectTitle)
        return response.send(401, 'Please enter the name of the project to be edited.');

    projectDao().lookup(oldprojectTitle, (err, projectObj) => {
        if (projectObj) {
            // Update the project
            projectDao().updateProject(oldprojectTitle, projectTitle, modulename, description, dueDate, completionDate,
                (noReplaced) => {
                    return response.send(401, "Successfully changed project! Please return to the Home Page.");
                },
                (err) => {
                    console.error("Error during database update! ", err);
                    return response.send(500, "Error during database update!");
                });
            return;
        } else {
            return response.send(401, "Project does not exist");
        }
    });
})


module.exports = projectController;