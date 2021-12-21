const express = require('express'),
app = express(),
mongoose = require("mongoose"),
UserService = require("./services/UserService"),
bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken'),
jwtSecret = '3CEF4ED34704B1F';

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

app.post("/auth", async (req, res) => {
  const {email, password} = req.body;

  let user = await UserService.FindByEmail(email);

  if(user.result != undefined){
    let isPasswordRight = await bcrypt.compare(password, user.result.password);

    if(!isPasswordRight){
      res.status(403);
      res.json({err: {password: 'Wrong password.'}});

    }else{
      jwt.sign({
        email, 
        name: user.result.name, 
        id: user.result._id
      }, jwtSecret, {expiresIn: '48h'}, (err, token) => {
        if(err){
          console.log(err);
          return res.status(500);
    
        }else{
          res.status(200);
          return res.json({token});
    
        }
        });
    }

  }else{
    res.status(403);
    return res.json({err: {email: 'E-mail not found.'}});
  }
});

module.exports = app;