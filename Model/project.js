//import the nedb module
const Datastore = require("nedb");

//the class can be instantiated with the db in embedded mode by providing a 
//data file or in-memory mode without it
class ProjectDAO {
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
        // this.db.insert({
        //     projectTitle: 'Project Scheduler',
        //     modulename: 'Web Platform Development 2',
        //     description: 'Group work developing a project Scheduler',
        //     isPrivate: true,
        //     shareLink: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), //edit this once we find out how share links work
        //     dueDate: Date.now(),
        //     completionDate: Date.now()
        // });

        // this.db.insert({
        //     projectTitle: 'Team Website',
        //     modulename: 'Integrated Project 3',
        //     description: 'test',
        //     isPrivate: true,
        //     shareLink: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), //edit this once we find out how share links work
        //     dueDate: Date.now(),
        //     completionDate: Date.now()
        // });
    }

    create(projectTitle, modulename, description, isPrivate, dueDate, completionDate) {
        var entry = {
            projectTitle: projectTitle,
            modulename: modulename,
            description: description,
            isPrivate: isPrivate,
            shareLink: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
            dueDate: dueDate,
            completionDate: completionDate
        }
        console.log("entry added")
        this.db.insert(entry, function (err, doc) {
            if (err) {
                console.log("Can't insert entry title: ", projectTitle);
            }
        });
    };

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

    lookupbyShareLink(linkid, cb) {
        this.db.find({ 'shareLink': linkid }, function (err, entries) {
            if (err) {
                return cb(err, null);
            } else {
                if (entries.length == 0)
                    return cb(null, null);

                return cb(null, entries[0]);
            }
        });
    }

    lookup(oldprojectTitle, cb) {
        this.db.find({ 'projectTitle': oldprojectTitle }, function (err, entries) {
            if (err) {
                return cb(err, null);
            } else {
                if (entries.length == 0)
                    return cb(null, null);

                return cb(null, entries[0]);
            }
        });
    }

    query(query, cb) {
        this.db.find(query, cb);
    }

    updateProject(id, 
            projectTitle, modulename, description, dueDate, completionDate, 
            isPrivate,
        success = (noReplaced) => { }, error = (err) => { }) 
    {
        let instance = this;
        instance.lookupId(id, (err, project) => {
            if (err) { if (error !== null) error(err); return; }

            // Check if project is not found
            if (project == null || project == undefined)
                return error != null ? error({ message: "Project not found" }) : null;

            // Update the fields        
            instance.db.update({'_id':id}, {
                    $set: {
                        projectTitle,
                        modulename,
                        description,
                        isPrivate,
                        dueDate,
                        completionDate 
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

    deleteProjectId(_id) {
        this.db.remove({ _id }, {}, (err, no)=>{});
    }

    /**
     * Delete the project
     * @param {string} targetProject
     * @deprecated Use deleteProjectId instead! 
     */
    deleteProject(targetProject) {
        this.db.remove({ projectTitle: targetProject }, {}, function (err, numRemoved) {
            /*callback(err, numRemoved);*/
        });
    }
    
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
    var appDir = path.dirname(require.main.filename) + "/app.project.db";

    let dao = new ProjectDAO(appDir);
    dao.init();
    return dao;
}

module.exports = setup;
