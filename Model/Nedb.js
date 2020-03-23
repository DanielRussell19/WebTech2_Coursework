const Datastore = require('nedb');

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
        this.db.find(entry, function(err, doc) {
            if (err) {
                console.log("Invalid entry");
            }
            else{
                console.log(doc);
                return doc;
            }
        });
    }

    init(){
        this.db.insert({
        type: 'UserAccount', 
        Username: 'Me',
        Password: 'Password', 
        Email: 'Email@Email.com'
        });
    console.log('new entry inserted');
}

}

module.exports = DAO;
