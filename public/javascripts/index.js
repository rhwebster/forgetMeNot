const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

window.addEventListener("DOMContentLoaded", async (event) => {
  const taskContainer = document.getElementById("list-of-tasks");
  const addTaskButton = document.getElementById("add-task-button");
  const taskField = document.getElementById("task-name");

  try {
    const res = await fetch("/api/tasks");
    let { tasks } = await res.json();
    const taskHtml = [];
    let html;
    tasks.forEach((task) => {
      let tags = task.TasksWithTags;
      html = `<li class="filled"><span class="task-text">${task.name}</span>`;
      tags.forEach((tag) => {
        html += `<span class="tag-class">${tag.name}</span>`;
      });
      if (task.due) {
        const today = new Date();
        const todayMonth = today.getMonth();
        const todayDate = today.getDate();
        const todayYear = today.getYear();
        const date = new Date(task.due);
        const month = date.getMonth();
        const monthText = months[month];
        const day = date.getDate();
        const year = date.getYear();
        if (day < todayDate) {
          html += `<span class="overdue date-text">${monthText} ${day}</span>`;
        } else if (
          month === todayMonth &&
          day === todayDate &&
          year === todayYear
        ) {
          html += `<span class="today date-text">Today</span>`;
        } else if (
          month === todayMonth &&
          day === todayDate + 1 &&
          year === todayYear
        ) {
          html += `<span class="date-text">Tomorrow</span>`;
        } else {
          html += `<span class="date-text">${monthText} ${day}</span>`;
        }
      }
      taskHtml.push(html);
    });
    for (let i = 0; i < 35 - tasks.length; i++) {
      taskHtml.push(`<li><span></span></li>`);
    }
    taskContainer.innerHTML = taskHtml.join("");
  } catch (e) {
    console.error(e);
  }

  const clickHandler = async (event) => {
    addTaskButton.classList.remove("shown");
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
        let tags = task.TasksWithTags;
        let html = `<li class="filled"><span class="task-text">${task.name}</span>`;
        tags.forEach((tag) => {
          html += `<span class="tag-class">${tag.name}</span>`;
        });
        if (task.due) {
          const today = new Date();
          const todayMonth = today.getMonth();
          const todayDate = today.getDate();
          const todayYear = today.getYear();
          const date = new Date(task.due);
          const month = date.getMonth();
          const monthText = months[month];
          const day = date.getDate();
          const year = date.getYear();
          if (day < todayDate) {
            html += `<span class="overdue date-text">${monthText} ${day}</span>`;
          } else if (
            month === todayMonth &&
            day === todayDate &&
            year === todayYear
          ) {
            html += `<span class="today date-text">Today</span>`;
          } else if (
            month === todayMonth &&
            day === todayDate + 1 &&
            year === todayYear
          ) {
            html += `<span class="date-text">Tomorrow</span>`;
          } else {
            html += `<span class="date-text">${monthText} ${day}</span>`;
          }
        }
        taskHtml.push(html);
      });
      for (let i = 0; i < 35 - tasks.length; i++) {
        taskHtml.push(`<li><span></span></li>`);
      }
      taskContainer.innerHTML = taskHtml.join("");
      taskField.value = "";
      taskField.blur();
    } catch (e) {
      console.error(e);
    }
  };
  addTaskButton.addEventListener("click", clickHandler);
  taskField.addEventListener("keyup", (event) => {
    if (!taskField.value.length) {
      addTaskButton.removeEventListener("click", clickHandler);
    } else {
      addTaskButton.addEventListener("click", clickHandler);
    }
  });
  taskField.addEventListener("focus", (event) => {
    addTaskButton.removeEventListener("click", clickHandler);
    addTaskButton.classList.add("shown");
  });
  taskField.addEventListener("blur", (event) => {
    addTaskButton.classList.remove("shown");
  });

  addTaskButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  // Get the modal

  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var addTagBtn = document.getElementById("addTagBtn");
  var addListBtn = document.getElementById("addListBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  addTagBtn.onclick = function () {
    modal.style.display = "block";
  };
  addListBtn.onclick = function () {
    modal.style.display = "block";
  };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };
});
