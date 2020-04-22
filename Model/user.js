//import the nedb module
const Datastore = require("nedb");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// the class can be instantiated with the db in embedded mode by providing a 
// data file or in-memory mode without it
class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }

    create(username, password, email) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            console.log({ username, password, hash, email });
            var entry = {
                username: username,
                password: hash,
                email: email
            };

            that.db.insert(entry, function (err) {
                if (err) {
                    console.log("Can't insert user: ", username);
                }
            });
        });
    }

    lookup(user, cb) {
        this.db.find({ 'username': user }, function (err, entries) {
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

    updatePassword(targetUser, hashThePassword, newPassword, success = (noReplaced) => {}, error = (err) => {}) {
        let instance = this;
        
        instance.lookup(targetUser, (err, user) => {
            if (err) {
                if (error !== null)
                    error(err);
                return;
            }

            // Check if user is not found
            if (user == null || user == undefined) 
                return error != null ? error({ message: "User not found" }) : null;
            
            // Update the password        
            if (hashThePassword) {
                bcrypt.hash(newPassword, saltRounds, (err, hash) => {
                    if (err) {
                        if (error !== null)
                            error(err);
                        return;
                    }
                    
                    instance.db.update({'username': targetUser}, { $set: {password: hash} }, {}, (err, noReplaced) => {
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
    
            instance.db.update({'username': userConfirm}, {$set: { password: hash }}, {}, (err, noReplaced) => {
                if (err) {
                    if (error !== null)
                        error(err);
                    return;
                }
                
                success(noReplaced);
            });
        });
    }

    deleteUser(targetUser) {
        this.db.remove({username: targetUser}, {}, function (err, numRemoved) {
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
    var appDir = path.dirname(require.main.filename) + "/app.users.db";

    let dao = new UserDAO(appDir);
    /*dao.init();*/
    return dao;
}

module.exports = setup;