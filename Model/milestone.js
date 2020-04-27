//import the nedb module
const Datastore = require("nedb");

//the class can be instantiated with the db in embedded mode by providing a 
//data file or in-memory mode without it
class milestoneDAO {
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

    create(milestoneName, description, dueDate, completionDate, projectid) {
        var entry = {
            milestoneName: milestoneName,
            description: description,
            dueDate: dueDate,
            completionDate: completionDate,
            projectid: projectid
        }
        console.log("entry added")
        this.db.insert(entry, function (err, doc) {
            if (err) {
                console.log("Can't insert entry title: ", milestoneName);
            }
        });
    };

    //update entry

    //remove entry

    //get specific milestone

    //get all milestones
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

    deletemilestoneId(_id) {
        this.db.remove({ _id }, {}, (err, no)=>{});
    }

    /**
     * Delete the milestone
     * @param {string} targetMilestone
     * @deprecated Use deletemilestoneId instead! 
     */
    deletemilestone(targetMilestone) {
        this.db.remove({ milestoneName: targetMilestone }, {}, function (err, numRemoved) {
            /*callback(err, numRemoved);*/
        });
    }

    updateMilestone(id, milestoneName, description, dueDate, completionDate, projectid,
    success = (noReplaced) => { }, error = (err) => { }) 
{
    let instance = this;
    instance.lookupId(id, (err, milestone) => {
        if (err) { if (error !== null) error(err); return; }

        // Check if project is not found
        if (milestone == null || milestone == undefined)
            return error != null ? error({ message: "milestone not found" }) : null;

        // Update the fields        
        instance.db.update({'_id':id}, {
                $set: {
                    milestoneName,
                    description,
                    dueDate,
                    completionDate ,
                    projectid
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
    var appDir = path.dirname(require.main.filename) + "/app.milestone.db";

    let dao = new milestoneDAO(appDir);
    dao.init();
    return dao;
}

module.exports = setup;
