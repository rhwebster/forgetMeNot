var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

const userValidators = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for First Name")
    .isLength({ max: 30 })
    .withMessage("First Name must not be more than 30 characters long"),
  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Last Name")
    .isLength({ max: 30 })
    .withMessage("Last Name must not be more than 30 characters long"),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address")
    .isLength({ max: 50 })
    .withMessage("Email Address must not be more than 50 characters long")
    .isEmail()
    .withMessage("Email Address is not a valid email")
    .custom((value) => {
      return db.User.findOne({ where: { emailAddress: value } }).then(
        (user) => {
          if (user) {
            return Promise.reject(
              "The provided Email Address is already in use by another account"
            );
          }
        }
      );
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password")
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "Password must not be more than 50 characters long and have at least 6 characters"
    ),
  check("confirmPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Confirm Password")
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "Password must not be more than 50 characters long and have at least 6 characters"
    )
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password does not match Password");
      }
      return true;
    }),
];
module.exports = router;
