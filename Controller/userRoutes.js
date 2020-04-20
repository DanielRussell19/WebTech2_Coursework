const express = require('express');
const userController = express.Router();
let userDAO = require('../Model/user.js');

let dao = new userDAO();
dao.init();

//test code for displaying users in the DB, remove before final release.
userController.get("/Homepage", function (request, response) {
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

userController.get("/Login", function(request, response) {
    response.render("Login");
});


userController.get('/Register', function (request, response) {
    response.render("Register");
})

userController.post("/Register", function(request, response) {
    const user = request.body.username;
    const password = request.body.pass;
    console.log("register user", user, "password ",  password);
    if (!user || !password) {
        response.send(401, 'no user or no password');
        return;
    }
    userDao.lookup(user, function(err, u) {
        if (u) {
            response.send(401, "User exists:", user);
            return;
        }
        useDao.create(user, password);
        response.redirect('/Login');
    });  
})



module.exports = userController;