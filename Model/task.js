//import the nedb module
const Datastore = require("nedb");

//the class can be instantiated with the db in embedded mode by providing a 
//data file or in-memory mode without it
class TaskDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }


    init() {
        //seeder methods
    }

    create(taskName, description, dueDate, completionDate, milestoneid) {
        var entry = {
            taskName: taskName,
            description: description,
            dueDate: dueDate,
            completionDate: completionDate,
            milestoneid: milestoneid
        }
        console.log("entry added")
        this.db.insert(entry, function (err, doc) {
            if (err) {
                console.log("Can't insert entry title: ", taskName);
            }
        });
    };

    //update entry

    //remove entry

    //get specific task

    //get all tasks
    getAllEntries() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, entries) {
                if (err) {
                    reject(err);
                    console.log('get all entries rejected');
                } else {
                    resolve(entries);
                    console.log('get all entries resolved');
                }
            });
        })
    }

    deletetaskId(_id) {
        this.db.remove({ _id }, {}, (err, no)=>{});
    }
    
    /**
     * Delete the task
     * @param {string} targettask
     * @deprecated Use deletetaskId instead! 
     */
    deletetask(targettask) {
        this.db.remove({ taskName: targettask }, {}, function (err, numRemoved) {
            /*callback(err, numRemoved);*/
        });
    }

    updateTask(id, taskName, description, dueDate, completionDate, milestoneid,
        success = (noReplaced) => { }, error = (err) => { }) 
    {
        let instance = this;
        instance.lookupId(id, (err, task) => {
            if (err) { if (error !== null) error(err); return; }
    
            // Check if project is not found
            if (task == null || task == undefined)
                return error != null ? error({ message: "task not found" }) : null;
    
            // Update the fields        
            instance.db.update({'_id':id}, {
                    $set: {
                        taskName,
                        description,
                        dueDate,
                        completionDate ,
                        milestoneid
                    }
                }, {}, (err, noReplaced) => {
                    if (err) {
                        if (error !== null)
                            error(err);
                        return;
                    }
    
                    success(noReplaced);
                });
        });
        return;
    }
    
        lookupId(id, cb) {
            this.db.find({ '_id': id }, function (err, entries) {
                if (err) {
                    return cb(err, null);
                } else {
                    if (entries.length == 0)
                        return cb(null, null);
    
                    return cb(null, entries[0]);
                }
            });
        }
}


function setup() {
    var path = require('path');
    var appDir = path.dirname(require.main.filename) + "/app.task.db";

    let dao = new TaskDAO(appDir);
    dao.init();
    return dao;
}

module.exports = setup;
