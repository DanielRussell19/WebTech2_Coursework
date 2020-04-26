// Library imports
let http = require("http");
let session = require('express-session');
let express = require("express");
let mustache = require("mustache-express");
let path = require("path")
let bodyParser = require("body-parser");
let auth = require('./auth/auth');

// Controller imports
let projectController = require('./Controller/projectRoutes.js');
let taskController = require('./Controller/taskRoutes.js');
let userController = require('./Controller/userRoutes.js');
let milestoneController = require('./Controller/milestoneRoutes');

// Express definitions
app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('mustache', mustache());
app.set('view engine', 'mustache');
app.set('Views', path.resolve(__dirname,'mustache'));

app.set('port', process.env.PORT || 2000);

// Use the ../static folder to serve static resources, e.g. images
var staticPath = path.resolve(__dirname, "../static");
app.use(express.static(staticPath));
 
app.use(session({ secret: 'dont tell anyone', resave: false, saveUninitialized: false }));

// initialize authentication with passport
auth.init(app); 

// Use controllers (defined above) for handling requests
app.use('/', projectController);
app.use('/', taskController);
app.use('/', userController);
app.use('/', milestoneController);

// Home landing page
app.get("/", function(req,res){
    res.render("LandingPage");
});

// For testing the mustache renderer 
app.get("/Page", function(req,res){
    res.render("page", { 'title': 'Hot topic of the day', 'subject': 'Corona'});
});

// Error view
app.use(function(request,response){
    response.type('text/plain');
    response.status(404);
    response.send("Error,404,Resource not found.");
});

// Port listener
app.listen(app.get('port'), function(){
    console.log("CTRL-c to close server.");
});