const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = {
  item: { type: String, required: true },
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  item: "Welcome to the To-Do List",
});

const item2 = new Item({
  item: "Hit the + button to add a new item",
});

const item3 = new Item({
  item: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
          res.redirect;
        }
      });
    } else {
      res.render("list", { ListTitle: "Today", newListItem: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const item = new Item({
    item: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  console.log(checkedItemId)
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("the data has been successfully deleted!");
    }
  });
  res.redirect("/");
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
