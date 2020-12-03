const express = require("express");

const router = express.Router();

const db = require("../db/models");
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");
const { loginUser, logoutUser, requireAuth } = require("../auth");

const listValidator = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for list name")
    .isLength({ max: 20 })
    .withMessage("List name must not be more than 20 characters long")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the list name")
    .custom((value) => {
      return db.List.findOne({ where: { name: value } }).then((list) => {
        if (list) {
          return Promise.reject("The provided list name already exists");
        }
      });
    }),
];
// /* GET users listing. */
router.get('/1', requireAuth, csrfProtection, listValidator, asyncHandler( async(req, res) => {
  res.render("list", {
    title: "Tasks in List",
    name: `${db.List.name}`,
    csrfToken: req.csrfToken(),

  });
 })); 

router.get("/", requireAuth, csrfProtection, listValidator, async(req, res) => {
  const userId = req.session.auth.userId;
  const list = await db.List.findAll({ where: { userId } });
  console.log(req)
  res.render("add-tag-or-list", {
    title: "Add a List",
    name: "List",
    path: "/lists",
    csrfToken: req.csrfToken(),
    list
  });
  
});

router.get('/lists/today', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId;
  const todayList = await db.Task.findAll({ where:
    [{ due: {
      [Op.gt]: new Date(),
      [Op.lt]: new Date(new Date().setDate(new Date().getDate())),
    }
  }, { userId }] })
  res.render("tasks-due-today", {
    title: "Due Today",
    name: "Today's Tasks",
    path: '/lists/today',
    csrfToken: req.csrfToken(),
    todayList
  })
}));

router.get('/lists/tomorrow', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId;
  const tomorrowList = await db.Task.findAll({
    where:
      [{
        due: {
          [Op.gt]: new Date(),
          [Op.lt]: new Date(new Date().setDate(new Date().getDate()) + 1),
        }
      }, { userId }]
  })
  res.render("tasks-due-tomorrow", {
    title: "Due Tomorrow",
    name: "Tomorrow's Tasks",
    path: '/lists/tomorrow',
    csrfToken: req.csrfToken(),
    tomorrowList
  })
}));

router.get('/lists/this-week', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const userId = req.session.auth.userId;
  const weekList = await db.Task.findAll({
    where:
      [{
        due: {
          [Op.gt]: new Date(),
          [Op.lt]: new Date(new Date().setDate(new Date().getDate()) + 7),
        }
      }, { userId }]
  })
  res.render("tasks-due-this-week", {
    title: "Due This Week",
    name: "This Week's Tasks",
    path: '/lists/this-week',
    csrfToken: req.csrfToken(),
    weekList
  })
}));

router.post(
  "/",
  requireAuth,
  csrfProtection,
  listValidator,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = req.session.auth.userId;
    const list = db.List.build({
      name,
      userId,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      console.log("Got a list name", name);
      await list.save();
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("add-tag-or-list", {
        title: "Add a List",
        name: "List",
        style: "./stylesheets/sign-up.css",
        path: "/lists",
        list,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

module.exports = router;
