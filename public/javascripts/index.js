// const asyncHandler = (handler) => (req, res, next) =>
//   handler(req, res, next).catch(next);

window.addEventListener("DOMContentLoaded", (event) => {
  const addTaskButton = document.getElementById("addTask");
  const taskField = document.getElementById("taskName");
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
      console.log(tasks);
      const taskContainer = document.getElementById("taskContainer");
      const newTask = tasks[tasks.length - 1].name;
      const li = document.createElement("li");
      li.innerHTML = newTask;
      taskContainer.appendChild(li);
    } catch (e) {
      console.error(e);
    }
  });
});
