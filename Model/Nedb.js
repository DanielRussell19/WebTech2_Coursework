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

    create(username, password) { 
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                user: username,
                password: hash,
            };
         console.log('user entry is: ', entry);
            
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
}

const dao = new UserDAO();
dao.init();
module.exports = dao;


/*const Datastore = require('nedb');

var nedb = new Datastore({
    filename: 'db.db',
    autoload: true
  });

class DAO {
    constructor(dbFilePath) {
        //run database as a file
        if (dbFilePath) {
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log("DB connected to file: ", dbFilePath);
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }

    //createUser(title, content, published) {
      //  var entry = {
        //    type: guestbookEntryField,
          //  title: title,
            //content: content,
            //published: published
        //};
        //this.db.insert(entry, function(err, doc) {
          //  if (err) {
            //    console.log("Can't insert entry title: ", title);
            //}
        //});
    //}

    ValidateUser(Username, Password) {
        var entry = {
            type: 'UserAccount',
            Username: Username,
            Password: Password,
            Email: 'Email@Email.com'
        };

        return new Promise((resolve, reject) => {
            this.db.count(entry, function (err, num) {
                if (err) {
                    reject(err);
                    console.log('rejected');
                } else {
                    resolve(num);
                    console.log('resolved');
                }
            });
        })

      //  this.db.count(entry, function(err, doc) {
      //      if (err) {
       //         console.log("Invalid entry");
        //    }
        ///    else{
          //      console.log(doc);
           //     return doc;
          //  }
        //});
    }

    init(){
        this.db.insert({
        type: 'AdminAccount', 
        Username: 'Admin',
        Password: 'Password', 
        Email: 'Email@Email.com'
        });
    console.log('admin entry inserted');
}

}

module.exports = DAO;*/
