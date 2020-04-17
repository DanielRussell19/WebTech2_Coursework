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
            username: 'test',
            password: 'test',
            email: 'test@test.com'
        });

        this.db.insert({
            username: 'admin',
            password: 'paper',
            email: 'admin@admin.com'
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

module.exports = DAO;
