const express=require('express');
const app=express();
const path=require("path");
const session = require('express-session');
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
const port=2000;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/gamedev');
}  

const questions=require("./models/question.js");
const user=require("./models/login.js")

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.get("/",(req,res)=>{
  if(req.session.logger&&req.session.username){
    let username=req.session.username;
    let logger=req.session.logger;
    res.render("home.ejs",{username,logger});
  }else{
      res.render("home.ejs");
  }
})
app.get("/home",(req,res)=>{
  if(req.session.logger&&req.session.username){
    let username=req.session.username;
    let logger=req.session.logger;
    res.render("home.ejs",{username,logger});
  }else{
      res.render("home.ejs");
  }
})
app.get("/login",(req,res)=>{
  res.render("login.ejs");
})
app.get("/signup",(req,res)=>{
  res.render("signup.ejs");
})

const checklogin = (req, res, next) => {
  if (req.headers.referer && req.headers.referer.includes('http://localhost:2000/')) {
    next();
  } else {
    res.send('you are not authorized');
  }
};


app.get("/test",checklogin,async (req, res) => {
  try {
    let data = await questions.find();
    module.exports = data;
    res.render("test.ejs", { data });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/test/result",async(req,res)=>{
  let {score}=req.body;
  let data= await questions.find() ;
  res.render("result.ejs",{score,data});
})
app.get("/addquestion",(req,res)=>{
  res.render("addquestion.ejs")
})
app.post("/test",(req,res)=>{
  let {question,A,B,C,D,answer}=req.body;
  let newquestion=new questions({
    question:question,
    A:A,
    B:B,
    C:C,
    D:D,
    answer:answer
  })
  newquestion.save().then((res)=>{
    console.log("saved successfully")
  });
  res.send("<h1>saved successfully</h1> <br><br><a href='home'>Back to home</a><br><br><a href='addquestion'>Add more questions</a>")
})

//signup

app.post("/home",(req,res)=>{
  let {logger,username,email,password}=req.body;
  req.session.username=username;
  req.session.logger=logger;
  let newuser=new user({
    logger:logger,
    username:username,
    email:email,
    password:password
  })
  newuser.save().then((res)=>{
    console.log("saved user data");
  })
  res.render("home.ejs",{username,logger});
})

//login check

app.post('/login', async (req, res) => {
  try {
    const check = await user.findOne({ email: req.body.email,password: req.body.password,logger:req.body.logger });
    username=check.username;
    logger=check.logger;
    if (check.password === req.body.password && check.email===req.body.email) {
      res.render('home.ejs',{username,logger});
    } else {
      res.send("Incorrect password");
    }
  } catch (e) {
    res.send("Wrong details");
  }
});

app.use((req,res)=>{
  res.send("Page not found");
})

app.listen(port,()=>{
    console.log("server listening at 2000");
})