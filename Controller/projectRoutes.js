const express = require('express');
const projectController = express.Router();
let projectDAO = require('../Model/project.js');

let dao = new projectDAO();
dao.init();

projectController.get("/Homepage", function (request, response) {
    dao.getAllEntries()
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

projectController.get('/AddProject', function (request, response) {
    response.render("AddProject");
})

projectController.post('/AddProject', function (request, response) {
    if (!request.body.projectTitle || !request.body.modulename || !request.body.description ||
        // !request.body.shareLink ||
            !request.body.dueDate || !request.body.completionDate) {
        response.status(400).send("Please fill in the empty fields.");
        return;
    }

    dao.create(request.body.projectTitle, request.body.modulename, request.body.description,
        request.body.isPrivate !== undefined, request.body.dueDate, request.body.completionDate);
    response.redirect("/HomePage");
})



module.exports = projectController;