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

    init(){
            this.db.insert({
            guestbookEntryField: 'guestbookEntryField', 
            title: 'like',
            content: 'nice', 
            published: '17/02/2020'
            });
        console.log('new entry inserted');
        }

}

module.exports = DAO;
