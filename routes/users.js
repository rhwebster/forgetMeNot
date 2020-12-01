var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/signup",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res) => {
    const { emailAddress, firstName, lastName, password } = req.body;
    const user = db.User.build({
      emailAddress,
      firstName,
      lastName,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      await db.List.create({
        name: "Inbox",
        userId: user.id,
      });
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("sign-up", {
        title: "Sign Up",
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);
module.exports = router;
