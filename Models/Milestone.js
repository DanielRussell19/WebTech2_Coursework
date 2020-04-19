//defines a Milestone object
class Milestone{
    //contructors
    constructor(MilestoneID,Milestonename,MilestoneDescription,ProjectID){
        this.MilestoneID = MilestoneID;
        this.Milestonename = Milestonename;
        this.MilestoneDescription = MilestoneDescription;
        this.ProjectID = ProjectID;
    }
}

module.exports = Milestone;