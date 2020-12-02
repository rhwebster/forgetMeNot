// const asyncHandler = (handler) => (req, res, next) =>
//   handler(req, res, next).catch(next);

window.addEventListener("DOMContentLoaded", async (event) => {
  const taskContainer = document.getElementById("list-of-tasks");
  const addTaskButton = document.getElementById("add-task-button");
  const taskField = document.getElementById("task-name");

  try {
    const res = await fetch("/api/tasks");
    let { tasks } = await res.json();
    const taskHtml = [];
    tasks.forEach((task) => {
      let html = `<li>${task.name}</li>`;
      taskHtml.push(html);
    });
    taskContainer.innerHTML = taskHtml.join("");
  } catch (e) {
    console.error(e);
  }

  addTaskButton.addEventListener("click", async (event) => {
    const value = taskField.value;
    const nameToSend = { name: value };
    try {
      const res = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      let { tasks } = await res.json();
      const taskHtml = [];
      tasks.forEach((task) => {
        let html = `<li>${task.name}</li>`;
        taskHtml.push(html);
      });
      taskContainer.innerHTML = taskHtml.join("");
    } catch (e) {
      console.error(e);
    }
  });
});
