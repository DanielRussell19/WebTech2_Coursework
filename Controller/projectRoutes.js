const express = require('express');
const controller = express.Router();
let projectDAO = require('../Model/project.js');

let dao = new projectDAO();

dao.init();


controller.get("/Homepage", function (request, response) {
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

controller.get('/AddProject', function (request, response) {
    response.render("AddProject");
})

controller.post('/AddProject', function (request, response) {
    if (!request.body.projectTitle || !request.body.modulename || !request.body.description ||
        !request.body.isPrivate || !request.body.shareLink || !request.body.dueDate || !request.body.completionDate) {
        response.status(400).send("Please fill in the empty fields.");
        return;
    }
    entries.create(request.body.projectTitle, request.body.modulename, request.body.description,
        request.body.isPrivate, request.body.dueDate, request.body.completionDate, Date.now());
    response.redirect("/HomePage");
})



module.exports = controller;