//defines a Task object
class Task{
    //contructors
    constructor(TaskID,Taskname, TaskDescription ,MilestoneID){
        this.TaskID = TaskID;
        this.Taskname = Taskname;
        this.TaskDescription = TaskDescription;
        this.MilestoneID = MilestoneID;
    }
}

module.exports = Task;