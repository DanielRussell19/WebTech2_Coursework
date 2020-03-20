//Imports
var http = require("http");
var express = require("express");
var mustache = require("mustache-express");

var path = require("path");

//definitions
app = express();

//setting port
app.set('port', process.env.PORT || 2000);

//landing page response
app.get("/", function(req,res){
    response.status(200);
    response.type('text/html');
    response.send('<h1>Landing Page</h1>');
});

//error response
app.use(function(request,response){
    response.type('text/plain');
    response.status(404);
    response.send("Error,404,Resource not found.");
});

//port listener
app.listen(app.get('port'), function(){
    console.log("CTRL-C to close server");
});