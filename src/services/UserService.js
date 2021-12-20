const schema = require("../models/User"), 
mongoose = require('mongoose');

const User = mongoose.model("Users", schema);

class UserService{

  async Create(user){
    try {
      let newUser = new User(user);
      await newUser.save();

      return {status: true};

    } catch (error) {
      console.log(error);
      return {status: false, error};
    }
  }

  async FindByEmail(email){
    try {
      
      let result = await User.findOne({email});
      return {status: true, result};

    } catch (error) {
      console.log(error);
      return {status: false, err: error};
    }
  }

  async Delete(email){
    try {
      await User.deleteOne({email});
      return {status: true};

    } catch (error) {
      console.log(error);
      return {status: false, err: error};
      
    }
  }
}

module.exports = new UserService();