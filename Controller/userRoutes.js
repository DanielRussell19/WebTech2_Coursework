const express = require('express');
const userController = express.Router();
const userDao = require("../Model/user.js");
const auth = require("../auth/auth.js");
const { ensureLoggedIn } = require('connect-ensure-login');


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
    const email = request.body.email;

    console.log("register user:", user, "password: ", password, "email:", email);
    if (!user || !password || !email) {
        response.send(401, 'no user or no password or no email');
        return;
    }

    userDao().lookup(user, function (err, u) {
        if (u) {
            response.send(401, "User exists:", user);
            return;
        }

        userDao().create(user, password, email);
        response.redirect('/Login');
    });
})

userController.get('/UpdateUser', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    response.render("UpdateUser");
})

userController.post("/UpdateUser", function (request, response) {

    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    const userConfirm = request.body.userConfirm;
    const passwordOld = request.body.passwordOld;
    const passwordEdit = request.body.passwordEdit;
    const emailConfirm = request.body.emailConfirm;

    console.log("old password: ", passwordOld);
    console.log("new password: ", passwordEdit);
    if (!passwordOld) {
        response.send(401, 'no old password entered');
        return;
    }
    if (!passwordEdit) {
        response.send(401, 'no new password entered');
        return;
    }

    userDao().updateLookup(userConfirm, passwordOld, emailConfirm, function (err, u) {
        if (u) {
            response.send(401, "User exists:", user);
            return;
        }

        userDao().update(userConfirm, emailConfirm, passwordOld, passwordEdit);
        response.redirect('/Login');
    });
})

userController.get("/RemoveUser", ensureLoggedIn('/Login'), function(request, response){
    response.render('RemoveUser');
});

userController.post("/RemoveUser", ensureLoggedIn('/Login'), function(request, response){
    request.logout();
    response.redirect('/');
});

userController.get("/Logout", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    request.logout();
    response.redirect("/");
});

module.exports = userController;