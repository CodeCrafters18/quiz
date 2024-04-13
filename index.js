const express = require('express');
const app = express();
const path = require("path");
const session = require('express-session');

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
const port = 2000;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://codecraftersalliance:ZcoAFIg6f4kgu2hE@cluster0.pz4irii.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

const questions = require("./models/question.js");
const user = require("./models/login.js")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Function to handle user login
function loginUser(req, username, logger) {
  req.session.username = username;
  req.session.logger = logger;
}

// Function to handle user logout
function logoutUser(req) {
  req.session.destroy();
}

// Function to check if user is logged in
function isLoggedIn(req) {
  return req.session.username && req.session.logger;
}

app.get("/", (req, res) => {
  if (isLoggedIn(req)) {
    let username = req.session.username;
    let logger = req.session.logger;
    res.render("home.ejs", { username, logger });
  } else {
    res.render("home.ejs");
  }
})

app.get("/home", (req, res) => {
  if (isLoggedIn(req)) {
    let username = req.session.username;
    let logger = req.session.logger;
    res.render("home.ejs", { username, logger });
  } else {
    res.render("home.ejs");
  }
})

app.get("/login", (req, res) => {
  res.render("login.ejs");
})

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
})

app.get("/test", async (req, res) => {
  try {
    let data = await questions.find();
    module.exports = data;
    res.render("test.ejs", { data });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.post("/test/result", async (req, res) => {
  let { score } = req.body;
  let data = await questions.find();
  res.render("result.ejs", { score, data });
})

app.get("/addquestion", (req, res) => {
  res.render("addquestion.ejs")
})

app.post("/test", (req, res) => {
  let { question, A, B, C, D, answer } = req.body;
  let newquestion = new questions({
    question: question,
    A: A,
    B: B,
    C: C,
    D: D,
    answer: answer
  })
  newquestion.save().then(() => {
    console.log("saved successfully")
    res.send("<h1>saved successfully</h1> <br><br><a href='home'>Back to home</a><br><br><a href='addquestion'>Add more questions</a>")
  }).catch(err => {
    res.status(500).send("Internal Server Error");
  });
})

app.post("/home", async (req, res) => {
  let { logger, username, email, password } = req.body;
  loginUser(req, username, logger);
  let newuser = new user({
    logger: logger,
    username: username,
    email: email,
    password: password
  })
  newuser.save().then(() => {
    console.log("saved user data");
    res.render("home.ejs", { username, logger });
  }).catch(err => {
    res.status(500).send("Internal Server Error");
  });
})

app.post('/login', async (req, res) => {
  try {
    const check = await user.findOne({ email: req.body.email, password: req.body.password, logger: req.body.logger });
    if (check && check.password === req.body.password && check.email === req.body.email) {
      loginUser(req, check.username, check.logger);
      res.render('home.ejs', { username: check.username, logger: check.logger });
    } else {
      res.send("Incorrect email, password, or logger");
    }
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
});

app.get('/logout', (req, res) => {
  logoutUser(req);
  res.redirect('/');
});

app.use((req, res) => {
  res.status(404).send("Page not found");
})

app.listen(port, () => {
  console.log("Server is running on port " + port);
})