//defines a Project object
class Project{
    //contructors
    constructor(ProjectID,Projectname,ProjectDescription,UserID){
        this.ProjectID = ProjectID;
        this.Projectname = Projectname;
        this.ProjectDescription = ProjectDescription;
        this.UserID = UserID;
    }
}

module.exports = Project;