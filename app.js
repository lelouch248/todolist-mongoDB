const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Karthik:karthik@cluster0.fohsgzm.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemSchema = {
  item: { type: String, required: true },
};

const Item = mongoose.model("Item", itemSchema);

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

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

app.get("/:customlist", function (req, res) {
  const customListName = _.capitalize(req.params.customlist);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //creating a new list
        console.log("does not exist");
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        console.log("new list created");
        res.redirect("/" + customListName);
      } else {
        //showing an existing list
        res.render("list", {
          ListTitle: foundList.name,
          newListItem: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    item: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  console.log(listName);
  if (listName == "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("the data has been successfully deleted!");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          console.log("successfully deleted");
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }
      }
    );
  }
});

// app.get("/work", function (req, res) {
//   res.render("list", { ListTitle: "Work", newListItem: workItems });
// });

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
