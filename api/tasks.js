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

router.get(
  "/tasks/all",
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId;
    const tasks = await Task.findAll({
      where: { userId },
      include: [
        List,
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
    // console.log(req.body);
    let { name, due, listId } = req.body;
    const userId = req.session.auth.userId;
    // console.log(listId === null);
    if (listId === null) {
      const list = await List.findOne({ where: { userId, name: "Inbox" } });
      listId = list.id;
    }
    const newTask = await Task.create({
      name,
      due,
      userId,
      listId,
      completed: false,
    });
    const task = await Task.findOne({
      where: { id: newTask.id },
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

router.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const taskId = req.params.id;
    const taggedTasks = await TaggedTask.findAll({
      where: {
        taskId,
      },
    });
    // console.log("I'm here");
    if (taggedTasks) {
      taggedTasks.forEach(async (tag) => {
        await tag.destroy();
      });
    }
    const task = await Task.findByPk(taskId);
    await task.destroy();
    res.json({ message: "Deleted" });
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

router.all(
  "/tasks/search/:taskName/?",
  asyncHandler(async (req, res) => {
    const taskNameToSearch = req.params.taskName;
    const userId = req.session.auth.userId;
    const whereObject = { userId };
    const { due, listId } = req.body;
    if (taskNameToSearch !== "all") {
      whereObject.name = {
        [Op.iLike]: `%${taskNameToSearch}%`,
      };
    }
    if (due) {
      if (!due.includes("to")) whereObject.due = new Date(due);
      else {
        const sunday = new Date(due.split("to")[0]);
        const saturday = new Date(due.split("to")[1]);
        whereObject.due = {
          [Op.between]: [sunday, saturday],
        };
      }
    } else if (listId) {
      whereObject.listId = listId;
    }
    console.table(whereObject);
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
    let { name, due, notes, listId, tagId, completed } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (name !== undefined) {
      await task.update({ name });
      res.json({ task });
    } else if (completed !== undefined) {
      await task.update({ completed });
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
      if (!taggedTask) {
        // if not then create one to add the link
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
    } else if (due) {
      await task.update({ due });
      res.json({ task });
    } else if (listId) {
      await task.update({ listId });
      const list = await List.findByPk(listId);
      res.json({ task, listName: list.name });
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
