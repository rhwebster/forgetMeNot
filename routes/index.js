var express = require("express");
const db = require("../db/models");
var router = express.Router();
const { Task, User, List, Tag, TaggedTask } = require("../db/models");
const { asyncHandler } = require("./utils");
const path = require('path');

/* GET home page. */

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    if (req.session.auth) {
      const userId = req.session.auth.userId;
      const list = await List.findOne({ where: { name: "Inbox", userId } });
      const tasks = await Task.findAll({
        where: {
          userId,
          listId: list.id,
        },
      });
      const tags = await Tag.findAll();
      let pageName = 'index'
      res.render("index", { title: "Forget Me Not Home", tasks, tags, pageName });
    } else {
      res.redirect('/users/login');
      // res.render("index", { title: "Forget Me Not Home"});
    }
  })
);

router.get('/images/logo', asyncHandler(async (req, res, next) => {
  res.sendFile(path.join(__dirname, '../images/fmnlogo1.png')); //square logo
  // res.sendFile(path.join(__dirname, '../images/fmnlogo2.png')); //the forgetmenot flower logo
}));

module.exports = router;
