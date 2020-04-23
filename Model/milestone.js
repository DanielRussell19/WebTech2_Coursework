
//import datastore module
const Datastore = require(nedb);

//Milestone class blueprint
function Milestone(MilestonID, MilestoneName, MilestoneDescription, DateDue, DateCompleted, ProjectID){
  this.MilestoneID = MilestonID;
  this.MilestoneName = MilestoneName;
  this.MilestonDescription = MilestoneDescription;
  this.DateDue = DateDue;
  this.DateCompleted = DateCompleted;
  this.ProjectID = ProjectID;
}

//create new Milestone object
//need to work on finind a way of taking user input to fill parameters
var milestone1 = new Milestone();

//insertion of milestone object to database
db.insert(Milestone, function(err, newMilestone)
  if(err == true){
    console.log("Insertion failed.");
  }else{
    console.log("New milestone added.")
  }
);
