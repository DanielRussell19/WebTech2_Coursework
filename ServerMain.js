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
let userController = require('./Controller/userRoutes.js');


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
app.use('/', userController);

// Home landing page
app.get("/", function(req,res){
    // Redirect if logged in
    if (req.user != null) { 
        res.redirect('/HomePage'); 
        return; 
    }
    res.render("LandingPage");
});


// Login View
app.get("/Login", function(req,res){
    // Redirect if logged in
    if (req.user != null) { 
        res.redirect('/HomePage'); 
        return; 
    }
    res.render("Login");
});

/*app.post('/Login',function(req,res){
    var user_name=req.body.user;
    var password=req.body.password;
    console.log("User name = "+user_name+", password is "+password);
    res.end("yes");
});*/

// Login View
app.post("/Login", function(req,res){
    // Redirect if logged in
    if (req.user != null) { 
        res.redirect('/HomePage'); 
        return; 
    }

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

// Error view
app.use(function(request,response){
    response.type('text/plain');
    response.status(404);
    response.send("Error, 404, Resource not found.");
});

// Port listener
app.listen(app.get('port'), function(){
    console.log("CTRL-c to close server.");
});