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

    res.render("AddProject", {
        'user': req.user.user
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




module.exports = projectController;