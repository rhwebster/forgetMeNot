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
  requireAuth,
  asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
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
    .withMessage("List name must not be more than 20 characters long"),
  // .custom((value) => !/\s/.test(value))
  // .withMessage("No spaces are allowed in the list name")
];
router.post(
  "/",
  requireAuth,
  // csrfProtection,
  listValidator,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { userId } = req.session.auth;
    console.log("\n\n\n", name, userId);
    const listFoundInDB = await db.List.findOne({ where: { name, userId } });
    let list;
    if (!listFoundInDB) {
      list = db.List.build({
        name,
        userId
      });
    }

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty() && !listFoundInDB) {
      await list.save();
      const lists = await db.List.findAll({
        where: {
          userId
        }
      });
      res.json({ lists });
    } else {      
      let errors = validatorErrors.array().map((error) => error.msg);
      if(listFoundInDB)
        errors.push(`List already exists for ${req.session.auth.userFirstName}`);
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
    const { userId } = req.session.auth;
    const list = await db.List.findOne({
      where: {
        id,
        userId
      },
    });
    try{
      await list.destroy();
      res.json({ id});
    } catch(e){
      res.status(400).json(e);
    }
  })
);

module.exports = router;
