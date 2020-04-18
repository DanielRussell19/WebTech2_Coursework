//import the nedb module
const Datastore = require("nedb");

//the class can be instantiated with the db in embedded mode by providing a 
//data file or in-memory mode without it
class DAO {
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
        this.db.insert({
            projectTitle: 'Project Scheduler',
            modulename: 'Web Platform Development 2',
            description: 'Group work developing a project Scheduler',
            isPrivate: true,
            shareLink: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), //edit this once we find out how share links work
            dueDate: Date.now(),
            completionDate: Date.now()
        });

        this.db.insert({
            projectTitle: 'Team Website',
            modulename: 'Integrated Project 3',
            description: 'test',
            isPrivate: true,
            shareLink: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), //edit this once we find out how share links work
            dueDate: Date.now(),
            completionDate: Date.now()
        });
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

module.exports = DAO;
