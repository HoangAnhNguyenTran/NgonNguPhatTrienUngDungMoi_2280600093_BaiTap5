var express = require("express");
var router = express.Router();

let roleModel = require("../schemas/roles");
let userModel = require("../schemas/users");

router.get("/", async function (req, res, next) {
  let roles = await roleModel.find({ isDeleted: false });
  res.send(roles);
});

router.get("/:id", async function (req, res, next) {
  try {
    let result = await roleModel.find({ _id: req.params.id, isDeleted: false });
    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(404).send({ message: "id not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "id not found" });
  }
});

// Get all users by role id: /roles/:id/users
router.get("/:id/users", async function (req, res, next) {
  try {
    let users = await userModel
      .find({
        isDeleted: false,
        role: req.params.id,
      })
      .populate({
        path: "role",
        select: "name description",
      });
    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/", async function (req, res, next) {
  try {
    let newItem = new roleModel({
      name: req.body.name,
      description: req.body.description,
    });
    await newItem.save();
    res.send(newItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await roleModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!updatedItem) {
      return res.status(404).send({ message: "id not found" });
    }
    res.send(updatedItem);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
