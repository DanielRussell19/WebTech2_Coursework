let bcrypt = require("bcrypt");
const saltRounds = 10;
const passwordTest = "Hello World!";

console.log("Password: " + passwordTest);

// Set password
bcrypt.hash("passwordHere", saltRounds, (error, hash) => {
    if (error !== undefined) {
        // Handle error
        return;
    }

    // Set user password here
})


// Check the password
bcrypt.compare(req.body.password, "bcrypt hash here", (error, res) => {
    if (res) {
        // Passwords match
        
    } else {
        // Passwords don't match
        
    }
})


////
//  Simple bcrypt test
//
////
bcrypt.hash(passwordTest, saltRounds, (error, hash) => {
    if (error !== undefined) {
        // Handle error
        return;
    }

    console.log("Salt: " + hash);

    console.log("Testing password (VALID)");
    bcrypt.compare(passwordTest, hash, function(err, res) {
        if (res) {
            // Passwords match
            console.log((passwordTest + ": Password matches!"));
        } else {
            // Passwords don't match
            console.log((passwordTest) + ": Password is invalid!");
        }
    });

    console.log("Testing password (INVALID)");
    bcrypt.compare(passwordTest + ",,", hash, function(err, res) {
        if (res) {
            // Passwords match
            console.log((passwordTest + ",,") + ": Password matches!");
        } else {
            // Passwords don't match
            console.log((passwordTest + ",,") + ": Password invalid!");
        }
    });
});