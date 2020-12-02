var express = require("express");
const db = require("../db/models");
var router = express.Router();
const { Task, User, List } = require("../db/models");
const { asyncHandler } = require("./utils");

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    console.log(req.session.auth);
    const userId = req.session.auth.userId;
    const list = await List.findOne({ where: { name: "Inbox", userId } });
    const tasks = await Task.findAll({
      where: {
        userId,
        listId: list.id,
      },
    });
    res.render("index", { title: "a/A Express Skeleton Home", tasks });
  })
);

module.exports = router;
