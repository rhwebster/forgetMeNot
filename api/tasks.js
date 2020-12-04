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
    const { name, due } = req.body;

    const userId = req.session.auth.userId;
    const list = await List.findOne({ where: { userId, name: "Inbox" } });
    const task = await Task.create({
      name,
      due,
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
  "/tasks/search/:taskName/?",
  asyncHandler(async (req, res) => {
    const taskNameToSearch = req.params.taskName;
    const userId = req.session.auth.userId;
    const whereObject = { userId };
    if (taskNameToSearch !== "all") {
      whereObject.name = {
        [Op.iLike]: `%${taskNameToSearch}%`,
      };
    }
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

router.get(
  "/tasks/search/:taskName/:tagId",
  asyncHandler(async (req, res) => {
    const taskNameToSearch = req.params.taskName;
    const userId = req.session.auth.userId;
    const whereObject = { userId };
    const tagId = req.params.tagId;
    let taggedTasks = await TaggedTask.findAll({
      where: {
        tagId,
      },
    });

    let tasks = [];
    for (let i = 0; i < taggedTasks.length; i++) {
      const task = await Task.findOne({
        where: {
          id: taggedTasks[i].taskId,
          userId: userId,
        },
        include: [
          {
            model: Tag,
            as: "TasksWithTags",
          },
        ],
        order: [["createdAt", "ASC"]],
      });
      if (task) tasks.push(task);
    }

    res.json({ tasks });
  })
);
router.put(
  "/tasks/:id/edit",
  asyncHandler(async (req, res) => {
    const { name, due, notes, list, tagId } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (name !== undefined) {
      await task.update({ name });
      res.json({ task });
    } else if (notes !== undefined) {
      await task.update({ notes });
      res.json({ task });
    } else if (tagId !== undefined) {
      taskId = req.params.id;
      let taggedTask = await TaggedTask.findOne({
        where: {
          taskId,
          tagId,
        },
      }); // Look to see if there is such a taggedTask
      if (!taggedTask) { // if not then create one to add the link
        taggedTask = await TaggedTask.create({
          taskId,
          tagId,
        });
      }
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
