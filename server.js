var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require("jwt-simple");
var bcrypt = require("bcrypt-nodejs");

var cors = require("cors");
var app = express();

var User = require("./models/User.js");

mongoose.Promise = Promise;

var posts = [{ message: "hello" }, { message: "hi" }];

app.use(cors());
app.use(bodyParser.json());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.get("/users", async (req, res) => {
  try {
    var users = await User.find({}, "-pwd -__v");
    res.send(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/profile/:id", async (req, res) => {
  try {
    var user = await User.findById(req.params.id, "-pwd -__v");
    res.send(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/register", (req, res) => {
  var userData = req.body;
  var user = new User(userData);
  user.save((err, result) => {
    if (err) console.log("saving user error");

    res.sendStatus(200);
  });
});

app.post("/login", async (req, res) => {
  var loginData = req.body;

  var user = await User.findOne({ email: loginData.email });
  if (!user) return res.sendStatus(401).send({ message: "Email invalid" });

  bcrypt.compare(loginData.pwd, user.pwd, (err, isMatch) => {
    if (!isMatch) return res.status(401).send({ message: "Password invalid" });

    var payload = {};

    var token = jwt.encode(payload, "123");

    console.log(token);

    res.status(200).send({ token });
  });
});

mongoose.connect(
  "mongodb://testadmin:testadmin12@ds213896.mlab.com:13896/vinisocial",
  { useNewUrlParser: true },

  err => {
    if (!err) console.log("connected to mongo");
  }
);

app.listen(3000);
