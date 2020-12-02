
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
      const res = await fetch("/api/tasks", {
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
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var addTagBtn = document.getElementById("addTagBtn");
  var addListBtn = document.getElementById("addListBtn");

  console.log(addTagBtn);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  addTagBtn.onclick = function () {
    modal.style.display = "block";
  }
  addListBtn.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }  
});
