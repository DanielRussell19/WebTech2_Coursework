const express = require('express');
const userController = express.Router();
const userDao = require("../Model/user.js");
const auth = require("../auth/auth.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

userController.get('/RemoveUser', function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    response.render("RemoveUser");
})

userController.post('/RemoveUser', function (request, response) {
    userDao().deleteUser(request.body.userConfirmDelete);
    response.redirect('/');
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

    console.log("Old password: ", passwordOld);
    console.log("New password: ", passwordEdit);

    if (!passwordOld)
        return response.send(401, 'no old password entered.');

    if (!passwordEdit)
        return response.send(401, 'no new password entered.');

    if (!userConfirm || userConfirm !== request.user.username)
        return response.send(401, "Username is not entered or is invalid.");

    userDao().lookup(request.user.username, (err, userObj) => {
        if (userObj) {
            bcrypt.compare(passwordOld, userObj.password, (error, same) => {
                if (err != null)
                    return response.send(500, "Im sorry there was an error when processing your request.");

                // If we have the same password
                if (same) {
                    // Update the password
                    userDao().updatePassword(request.user.username, true, passwordEdit,
                        (noReplaced) => {
                            return response.send(401, "Successfully changed password!");
                        },
                        (err) => {
                            console.error("Error during database update! ", err);
                            return response.send(500, "Error during database update!");
                        });
                } else {
                    // Display error
                    return response.send(401, "Incorrect password!");
                }
            });

            return;
        } else {
            return response.send(401, "User does not exist");
        }
    });
})

userController.get("/Logout", function (request, response) {
    // Check if the user is logged in
    if (request.user == null) { response.redirect('/'); return; }

    request.logout();
    response.redirect("/");
});


module.exports = userController;