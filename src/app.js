const express = require('express'),
app = express(),
mongoose = require("mongoose"),
UserService = require("./services/UserService"),
bcrypt = require('bcrypt');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/imgshare", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {}).catch(err => { 
  console.log(err); 
});

app.get("/", (req, res) => {
  res.json({});
});

app.post("/users", async (req, res) => {
  const {name, email, password} = req.body;

  if(email == '' || name == '' || password == ''){
    res.status(400);
    return res.json({err: 'Invalid fields.'});

  }

  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);

  const user = { name, email, password: hash};

  let userExists = await UserService.FindByEmail(email);

  if(userExists.status){
    if(userExists.result != undefined){
      res.status(400);
      return res.json({err: 'E-mail already exists.'});
      
    }else{
      let result = await UserService.Create(user);

      if(result.status){
        res.status(200);
        return res.json({email});

      }else{
        res.status(500);
        return res.json({err: result.err});

      }
    }

  }else{
    res.status(500);
    return res.json({err: userExists.err});
  }
});

app.delete("/users/:email", async (req, res) => {
  let email = req.params.email;

  let result = await UserService.Delete(email);

  if(result.status){
    res.status(200);
    res.json({msg: 'User has been deleted.'});

  }else{
    res.status(500);
    res.json({err: result.err});
  }
});

module.exports = app;