//defines a User object
class User{
    //contructors
    constructor(UserID,Username,Password,Email){
        this.UserID = UserID;
        this.Username = Username;
        this.Password = Password;
        this.Email = Email;
    }
}

module.exports = User;