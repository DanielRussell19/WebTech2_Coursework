//imports
var http = require("http");
var express = require("express");
var mustache = require("mustache-express");

var bodyParser = require("body-parser");

var DAO = require('./Models/Nedb');
var dbFile = 'database.nedb.db';

let dao = new DAO(dbFile);
dao.init();

var path = require("path");

//definitions
app = express();
app.engine('mustache',mustache());
app.set('view engine', 'mustache');
app.set('Views',path.resolve(__dirname,'mustache'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 2000);

//home landing page
app.get("/", function(req,res){
    res.render("LandingPage");
});

//Login View
app.get("/Login", function(req,res){
    res.render("Login");
});

//Login View
app.post("/Login", function(req,res){
    if (!req.body.TxtUsername || !req.body.TxtPassword) {
        res.status(400).send("Entries must have a Username and Password.");
        return;
    }

    dao.ValidateUser(req.body.TxtUsername,req.body.TxtPassword)
    .then((num) => {
        console.log(num);
        if(num >0){
            res.render("Homepage", { username: req.body.TxtUsername });
        }
        else{
            res.status(400).send("No entry found.");
            return;
        }
    })
    .catch((err) => {
        console.log('Error: ')
        console.log(JSON.stringify(err))
    });  
});

//Register view
app.get("/Register", function(req,res){
    res.render("Register");
});

//Get Users view
app.get("/Homepage", function(req,res){
    res.render("Homepage");
});

//Update User view
app.get("/UpdateUser", function(req,res){
    res.render("UpdateUser");
});

//Remove User view
app.get("/RemoveUser", function(req,res){
    res.render("RemoveUser");
});

//Logout View
app.get("/Logout", function(req,res){
    res.render("Logout");
});

//for testing the mustache rendereror 
app.get("/Page", function(req,res){
    res.render("page", { 'title': 'Hot topic of the day', 'subject': 'Corona'});
});

//Error view
app.use(function(request,response){
    response.type('text/plain');
    response.status(404);
    response.send("Error,404,Resource not found.");
});

//Port listener
app.listen(app.get('port'), function(){
    console.log("CTRL-c to close server. DONT CLOSE TERMINAL I SWEAR DON'T DO!!");
});