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
        // this.db.insert({
        //     username: 'test',
        //     password: 'test',
        //     email: 'test@test.com'
        // });
        //
        // this.db.insert({
        //     username: 'admin',
        //     password: 'paper',
        //     email: 'admin@admin.com'
        // });
    }

    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            console.log({username, password, hash});
            var entry = {
                username: username,
                password: hash,
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