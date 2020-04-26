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


    init() {
        //seeder method
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
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
        });
    }

    updateLookup(user, password, email, cb) {
        this.db.find({ $where: { 'username': user } && { 'password': password } && { 'email': email } }, function (err, entries) {
            if (err) {
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
        });
    }

    update(userConfirm, emailConfirm, passwordOld, passwordEdit) {
        this.db.update({ $where: { 'username': userConfirm } && { 'email': emailConfirm }}, {'password': passwordOld }, { 'password': passwordEdit }, function (err, numReplaced) {
            return;
        });
    }

    delete(user, cb) {
        this.db.find({ 'username': user }, function (err, entries) {
            if (err) {
                return cb(null, null);
            } else {
                if (entries.length == 0) {
                    return cb(null, null);
                }
                return cb(null, entries[0]);
            }
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
    dao.init();
    return dao;
}

module.exports = setup;