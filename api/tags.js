var express = require("express");

var router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db/models");
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("../routes/utils");
const { loginUser, logoutUser, requireAuth } = require("../auth");
const { Op } = require('sequelize');

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const tags = await db.Tag.findAll();
    res.json({ tags });
  })
);

router.post(
  "/",
  // requireAuth,
  // csrfProtection,
  // tagValidator,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    console.log('Tag name', name);
    const tag = db.Tag.build({
      name,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await tag.save();
      const tags = await db.Tag.findAll();
      console.log('all tags', tags);
      res.json({ tags });
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("add-tag-or-list", {
        title: "Add a Tag",
        name: "Tag",
        path: "/api/tags",
        tag,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);
router.delete(
  "/:name",
  // requireAuth,
  // csrfProtection,
  // tagValidator,
  asyncHandler(async (req, res) => {
    const { name } = req.params;
    console.log('name to delete ', name);
    console.log('Tag name', name);
    const tag = await db.Tag.findOne({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        }
      },
    });
    await tag.destroy();
    console.log('found a tag', tag);
    res.json({name});
  })
);

module.exports = router;
