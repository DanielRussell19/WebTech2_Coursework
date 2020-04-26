const express = require('express');
const projectController = express.Router();
const projectDao = require('../Model/project.js');
const taskDAO = require('../Model/task.js');
const milestoneDAO = require('../Model/milestone.js');
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

//View project to interface house a milestone and task listing.
projectController.get('/ViewProject/:id', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the project id
    const projectId = request.params.id;
    if (projectId == null) 
        return response.send(401, "Project ID is not set!");

    const dao = projectDao();
    dao.lookupId(projectId, (err, project) => {
        if (project) {
            console.log(project);

            milestoneDAO().getAllEntries().then((listmilestones) => {
                console.log(listmilestones);

                taskDAO().getAllEntries().then((listtasks) => {
                    console.log(listtasks);
           
                    response.render("ViewProject", {project:project, listtasks:listtasks, listmilestones:listmilestones}, );
                })
                .catch((err) => {
                    console.log('Error: ')
                    console.log(JSON.stringify(err))
                });
            })
            .catch((err) => {
                console.log('Error: ')
                console.log(JSON.stringify(err))
            });
        } else {
            return response.send(401, "Project does not exist");
        }
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
    if (request.user == null) { response.redirect('/'); return; } */
    if (!request.body.projectTitle || !request.body.modulename || !request.body.description ||
        !request.body.dueDate || !request.body.completionDate) {
        response.status(400).send("Please fill in the empty fields.");
        return;
    }

    projectDao().create(request.body.projectTitle, request.body.modulename, request.body.description,
        request.body.isPrivate !== undefined, request.body.dueDate, request.body.completionDate);
    response.redirect("/HomePage");
});

projectController.get('/RemoveProject/:id', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the project id
    const projectId = request.params.id;
    if (projectId == null) 
        return response.send(401, "Project ID is not set!");

    response.render("RemoveProject", {projectId});
})

projectController.post('/RemoveProject/:id', function (request, response) {
    // Get the project id
    const projectId = request.params.id;
    if (projectId == null) 
        return response.send(401, "Project ID is not set!");

    projectDao().deleteProjectId(projectId);
    return response.redirect('/');
})

projectController.get('/UpdateProject/:id', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the project id
    const projectId = request.params.id;
    if (projectId == null) 
        return response.send(401, "Project ID is not set!");

    const dao = projectDao();
    dao.lookupId(projectId, (err, project) => {
        if (project) {
            console.log(project);
            response.render("UpdateProject", {project});
        } else {
            return response.send(401, "Project does not exist");
        }
    });

})

projectController.post("/UpdateProject/:id", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    // Get the project id
    const projectId = request.params.id;
    if (projectId == null) 
        return response.send(401, "Project ID is not set!");

    let   isPrivate = request.body.isPrivate;
    const projectTitle = request.body.projectTitle;
    const modulename = request.body.modulename;
    const description = request.body.description;
    const dueDate = request.body.dueDate;
    const completionDate = request.body.completionDate;

//  console.log("New title: ", projectTitle);
//  console.log("New module name: ", modulename);
//  console.log("New description: ", description);
//  console.log("New due date: ", dueDate);
//  console.log("New completion date: ", completionDate);

    // Make sure isPrivate is a boolean
    if (isPrivate == null || isPrivate === undefined) {
        isPrivate = false;
    } else {
        isPrivate = true;
    }

    projectDao().lookupId(projectId, (err, projectObj) => {
        if (projectObj) {
            // Update the project
            projectDao().updateProject(projectId, projectTitle, modulename, description, dueDate, completionDate, isPrivate,
                (noReplaced) => {
                    return response.send(401, 
                        "Successfully changed project! Please return to the <a href=\"/\">Home Page</a>.");
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