const Datastore = require("nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            this.db = new Datastore();
        }
    }
     init() {
        this.db.insert({
            user: 'Peter',
            password: 
'$2b$10$I82WRFuGghOMjtu3LLZW9OAMrmYOlMZjEEkh.vx.K2MM05iu5hY2C'
        });
        console.log('user record inserted in init');
        
        this.db.insert({
            user: 'Ann',
            password: 
'$2b$10$bnEYkqZM.MhEF/LycycymOeVwkQONq8kuAUGx6G5tF9UtUcaYDs3S'            
        });
        console.log('user record inserted in init');
        return this;
    }


    create(username, password, email) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function (hash) {
            console.log({username, password, hash, email});
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
        this.db.find({'user': user}, function (err, entries) {
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

}

const dao = new UserDAO();
dao.init();
module.exports = dao;
