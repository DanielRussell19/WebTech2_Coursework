const express = require('express');
const userController = express.Router();
const userDao = require("../Model/user.js");
const auth = require("../auth/auth.js");


//test code for displaying users in the DB, remove before final release.
userController.get("/Homepage", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    userDao().getAllEntries()
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

userController.get("/Login", function (request, response) {
    response.render("Login");
});

userController.post("/Login", auth.authorize("/Login"), function (request, response) {
    response.redirect("/HomePage");
});


userController.get('/Register', function (request, response) {
    response.render("Register");
})

userController.post("/Register", function (request, response) {
    const user = request.body.username;
    const password = request.body.pass;

    console.log("register user", user, "password ", password);
    if (!user || !password) {
        response.send(401, 'no user or no password');
        return;
    }

    userDao().lookup(user, function (err, u) {
        if (u) {
            response.send(401, "User exists:", user);
            return;
        }

        userDao().create(user, password);
        response.redirect('/Login');
    });
})

userController.get("logout", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }
    
    request.logout();
    response.redirect("/");
});


module.exports = userController;