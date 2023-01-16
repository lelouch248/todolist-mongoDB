const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

var items = ["buy food", "cook food"];
var workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  let day = today.toLocaleDateString("en-US", options);

  res.render("list", { ListTitle: day, newListItem: items });
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  console.log(req.body);
  console.log(req.body.list); 
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});


app.get("/work", function (req, res) {
  res.render("list", { ListTitle: "Work", newListItem: workItems });
});

app.post("/work", function (req, res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
});


app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("server is running on port 3000");
});
