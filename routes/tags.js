var express = require("express");

var router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");
const { loginUser, logoutUser, requireAuth } = require("../auth");

const tagValidator = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for tag name")
    .isLength({ max: 20 })
    .withMessage("Tag name must not be more than 20 characters long")
    .custom((value) => !/\s/.test(value))
    .withMessage("No spaces are allowed in the tag name")
    .custom((value) => {
      return db.Tag.findOne({ where: { name: value } }).then((tag) => {
        if (tag) {
          return Promise.reject("The provided tag name already exists");
        }
      });
    }),
];
/* GET users listing. */
router.get("/", requireAuth, csrfProtection, tagValidator, (req, res) => {
  res.render("add-tag-or-list", {
    title: "Add a Tag",
    name: "Tag",
    path: "/tags",
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/",
  requireAuth,
  csrfProtection,
  tagValidator,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const tag = db.Tag.build({
      name,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await tag.save();
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("add-tag-or-list", {
        title: "Add a Tag",
        name: "Tag",
        path: "/tags",
        tag,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

module.exports = router;
