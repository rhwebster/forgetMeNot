const express = require("express");
const router = express.Router();
const { Task, User, List, Tag, TaggedTask } = require("../db/models");
const { asyncHandler } = require("../routes/utils");
const { Op } = require("sequelize");

router.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const list = await List.findOne({ where: { userId, name: "Inbox" } });
    const tasks = await Task.findAll({
      where: { userId, listId: list.id },
      include: [
        {
          model: Tag,
          as: "TasksWithTags",
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.json({ tasks });
  })
);

router.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const { name } = req.body;

    const userId = req.session.auth.userId;
    const list = await List.findOne({ where: { userId, name: "Inbox" } });
    const task = await Task.create({
      name,
      userId,
      listId: list.id,
      completed: false,
    });
    const tasks = await Task.findAll({
      where: { userId, listId: list.id },
      include: [
        {
          model: Tag,
          as: "TasksWithTags",
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.json({ tasks });
  })
);

router.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    console.log(taskId);
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        List,
        {
          model: Tag,
          as: "TasksWithTags",
        },
      ],
    });
    res.json({ task });
  })
);

router.get(
  "/tasks/search/:text",
  asyncHandler(async (req, res) => {
    const textToSearch = req.params.text;
    const userId = req.session.auth.userId;
    const whereObject = { userId };
    console.log("texttoSearch", textToSearch);
    if (textToSearch !== "all") {
      whereObject.name = {
        [Op.iLike]: `%${textToSearch}%`,
      };
    }
    console.log("\n\nWhereobject", whereObject);
    const tasks = await Task.findAll({
      where: whereObject,
      include: [
        {
          model: Tag,
          as: "TasksWithTags",
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.json({ tasks });
  })
);

router.put(
  "/tasks/:id/edit",
  asyncHandler(async (req, res) => {
    const { name, due, notes, list } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (name !== undefined) {
      await task.update({ name });
      res.json({ task });
    } else if (notes !== undefined) {
      await task.update({ notes });
      res.json({ task });
    }
  })
);

router.delete(
  "/tasks/:taskId/tag/:tagId/delete",
  asyncHandler(async (req, res) => {
    const taskId = req.params.taskId;
    const tagId = req.params.tagId;
    const taggedTask = await TaggedTask.findOne({
      where: {
        taskId,
        tagId,
      },
    });
    await taggedTask.destroy();
    const task = await Task.findOne({
      where: { id: taskId },
      include: [
        List,
        {
          model: Tag,
          as: "TasksWithTags",
        },
      ],
    });
    res.json({ task });
  })
);

module.exports = router;
