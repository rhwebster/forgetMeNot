var express = require("express");

var router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("../routes/utils");
const { loginUser, logoutUser, requireAuth } = require("../auth");
const { Op } = require("sequelize");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const lists = [];
    res.json({ lists });
  })
);
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userId } = req.body;
    const lists = await db.List.findAll({
      where: {
        userId
      }
    });
    res.json({ lists });
  })
);
const listValidator = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for list name")
    .isLength({ max: 20 })
    .withMessage("List name must not be more than 20 characters long")
    // .custom((value) => !/\s/.test(value))
    // .withMessage("No spaces are allowed in the list name")
    .custom((value) => {
      return db.List.findOne({ where: { name: value, userId } }).then((list) => {
        if (list) {
          return Promise.reject("The provided list name already exists");
        }
      });
    }),
];
router.post(
  "/",
  requireAuth,
  // csrfProtection,
  listValidator,
  asyncHandler(async (req, res) => {
    const { name, userId } = req.body;
    const list = db.List.build({
      name,
      userId
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await list.save();
      const lists = await db.List.findAll({
        where: {
          userId
        }
      });
      res.json({ lists });
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.status(400).json({ errors });
    }
  })
);
router.delete(
  "/:id",
  requireAuth,
  // csrfProtection,
  // tagValidator,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    const list = await db.List.findOne({
      where: {
        id,
        userId
      },
    });
    await list.destroy();
    res.json({ id, userId });
  })
);

module.exports = router;
