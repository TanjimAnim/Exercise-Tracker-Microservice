const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect(process.env.MLAB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.use(cors());

//app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const exerciseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exerciseSchema],
  count: Number
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

app.post("/api/exercise/new-user", urlencodedParser, async (req, res) => {
  try {
    if (req.body.username === "") return res.redirect("/");

    var existingUser = await User.findOne({ username: req.body.username });
    if (existingUser === null) {
      var newUser = new User({
        username: req.body.username
      });

      await newUser.save();
      return res.json({ username: newUser.username, _id: newUser._id });
    } else if (existingUser.username === req.body.username) {
      res.json({ error: "Username Already Taken. Enter Again" });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: "can not create user" });
  }
});
app.get("/api/exercise/users", async (req, res, next) => {
  try {
    var getAllUsers = await User.find({});
  } catch (err) {
    console.log(err);
    res.json({ error: "Failed to get users" });
  }

  res.json(getAllUsers);
});

app.post("/api/exercise/add", urlencodedParser, async (req, res) => {
  try {
    if (
      req.body.description === "" ||
      req.body.duration === "" ||
      req.body.userId === ""
    ) {
      return res.json({ error: "please enter required fields" });
    }
    if (req.body.date === "") {
      var newDate = new Date().toISOString().substring(0, 10);
    } else {
      newDate = req.body.date;
    }

    var newExerciseItem = new Exercise({
      description: req.body.description,
      duration: parseInt(req.body.duration),
      date: newDate
    });
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { log: newExerciseItem } },
      { new: true }
    );
    console.log(updatedUser);
    res.json({
      username: updatedUser.username,
      _id: updatedUser._id,
      description: newExerciseItem.description,
      duration: newExerciseItem.duration,
      date: new Date(newExerciseItem.date).toDateString()
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "error occured" });
  }
});

app.get("/api/exercise/log", urlencodedParser, async (req, res, next) => {
  const { userId, from, to, limit } = req.query;

  await User.findById(userId, (err, result) => {
    if (!err) {
      let responseObject = result;
      if (from || to) {
        let fromDate = new Date(0);
        let toDate = new Date();

        if (from) {
          fromDate = new Date(from).getTime();
        }

        if (to) {
          toDate = new Date(to).getTime();
        }

        responseObject.log = responseObject.log.filter(session => {
          let sessionDate = new Date(session.date).getTime();
          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }

      if (limit) {
        responseObject.log = responseObject.log.slice(0, limit);
      }

      responseObject["count"] = result.log.length;
      res.json(responseObject);
    }
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
