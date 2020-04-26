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
}

function setup() {
    var path = require('path');
    var appDir = path.dirname(require.main.filename) + "/app.task.db";

    let dao = new TaskDAO(appDir);
    dao.init();
    return dao;
}

module.exports = setup;
