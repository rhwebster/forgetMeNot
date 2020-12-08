const { decodeBase64 } = require("bcryptjs");
var express = require("express");

var router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");
const { loginUser, logoutUser, requireAuth } = require("../auth");
const { Op } = require('sequelize');

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/login", csrfProtection, (req, res) => {
  res.render("log-in", {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

router.get("/lists", csrfProtection, (req, res) => {
  res.render("lists", {
    title: "Lists",
    csrfToken: req.csrfToken(),
  });
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
      return db.User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(
            "The provided Email Address is already in use by another account"
          );
        }
      });
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

router.get("/signup", csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render("sign-up", {
    title: "Sign Up",
    style: "./stylesheets/sign-up.css",
    user,
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/signup",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    const user = db.User.build({
      email,
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
      loginUser(req, res, user);
      res.redirect("/");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("sign-up", {
        title: "Sign Up",
        style: "./stylesheets/sign-up.css",
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

const loginValidators = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide Email Address"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a valid Password"),
];

router.post(
  "/login",
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let errors = [];
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );

        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect("/");
        }
      }

      errors.push(
        "Invalid credentials. Please doublecheck email address and password"
      );
    } else {
      errors = validationErrors.array().map((error) => error.msg);
    }

    res.render("log-in", {
      title: "Login",
      email,
      errors,
      csrfToken: req.csrfToken(),
    });
  })
);


router.all("/logout", (req, res) => {
  logoutUser(req, res);
  res.redirect("/users/login");
});

router.post('/addfriend',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { email } = req.body;
    const userToAdd = await db.User.findOne({
      where: {
        email
      }
    });
    if (userToAdd) {
      // res.json({ userToAdd });
      let user1Id = userId;
      let user2Id = userToAdd.id;
      if (user1Id > user2Id) {
        let temp = user1Id;
        user1Id = user2Id;
        user2Id = temp;
      }
      const requests = await db.Relationship.findOne({
        where: {
          user1Id,
          user2Id,
        }
      });
      if (requests) {
        return res.status(400).json({ error: "Relationship already exists" });
      }

      const request = await db.Relationship.create({
        user1Id,
        user2Id,
        status: 0,
        lastActionUserId: userId
      });
      // console.log("\n\n", db.Relationship);
      res.json({ request });
    } else {
      res.status(400).json({ error: "User not found to add" });
    }
  })
);

router.get('/relationships',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const relationships1 = await db.Relationship.findAll({
      where: {
        user1Id: userId,
        // lastActionUserId: {
        //   [Op.ne]: userId
        // }
      }
    });
    const relationships2 = await db.Relationship.findAll({
      where: {
        user2Id: userId,
        // lastActionUserId: {
        //   [Op.ne]: userId
        // }
      }
    });
    const allRelationships = [...relationships1, ...relationships2];
    const addedRelationships = allRelationships.filter(relationship => {
      return relationship.status === 1;
    });

    const addedContacts = [];
    for (let i = 0; i < addedRelationships.length; i++) {
      let rel = addedRelationships[i];
      let idToFind = rel.user1Id;
      if (idToFind === userId) idToFind = rel.user2Id;
      const contact = await db.User.findByPk(idToFind);
      addedContacts.push(contact);
    }

    const awaitingRelationships = allRelationships.filter(relationship => {
      return (relationship.status === 0 && relationship.lastActionUserId !== userId);
    });
    const awaitingContacts = [];
    for (let i = 0; i < awaitingRelationships.length; i++) {
      let rel = awaitingRelationships[i];
      let idToFind = rel.user1Id;
      if (idToFind === userId) idToFind = rel.user2Id;
      const contact = await db.User.findByPk(idToFind);
      awaitingContacts.push(contact);
    }
    res.json({ addedContacts, awaitingContacts, addedRelationships, awaitingRelationships });
  })
);

router.post('/relationships',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { friendId, action } = req.body;
    let user1Id = userId;
    let user2Id = friendId;
    if (user1Id > user2Id) {
      let temp = user1Id;
      user1Id = user2Id;
      user2Id = temp;
    }
    console.log('\n\naction', action);
    
    const relationship = await db.Relationship.findOne({
      where: {
        user1Id,
        user2Id,
        status: 0,
        lastActionUserId: friendId
      }
    });
    if (relationship) {
      if (action === "accept" || action === "block") {
        let status = 1;
        let requestStatus = "added";
        if (action === "block") {
          status = 3;
          requestStatus = "blocked"
        }
        await relationship.update({
          status,
          lastActionUserId: userId
        });
        res.json({ requestStatus });
      } else if (action === "deny") {
        await relationship.destroy();
        res.json({ requestStatus: "denied" });
      }
    } else {
      res.status(400).json({ error: "something wrong" });
    }
  })
);

module.exports = router;
