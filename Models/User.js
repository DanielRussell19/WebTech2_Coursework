//defines a user object
class User{
    //variables
    username = null;
    password = null;
    email = null;

    //contructors
    constructor(username,password,email){
        this.username = username;
        this.password = password;
        this.email = email;
    }
}

module.exports = User;