
window.addEventListener("DOMContentLoaded", async (event) => {
  const taskContainer = document.getElementById("list-of-tasks");
  const addTaskButton = document.getElementById("add-task-button");
  const taskField = document.getElementById("task-name");
  const tagContainer = document.getElementById("list-of-tags-div");

  try {
    const res = await fetch("/api/tasks");
    let { tasks } = await res.json();
    const taskHtml = [];
    tasks.forEach((task) => {
      let tags = task.TasksWithTags;
      let html = `<li><div>${task.name}`;
      tags.forEach((tag) => {
        html += `<span class="tag-class">${tag.name}</span>`;
      });
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
        let tags = task.TasksWithTags;
        let html = `<li>${task.name}`;
        tags.forEach((tag) => {
          html += `<span class="tag-class">${tag.name}</span>`;
        });
        taskHtml.push(html);
      });
      taskContainer.innerHTML = taskHtml.join("");
    } catch (e) {
      console.error(e);
    }
  });

  async function populateTags(tagPostObject = {}) {
    try {
      const res = await fetch("/api/tags", tagPostObject);
      let { tags } = await res.json();
      const tagHtml = [];
      tags.forEach((tag) => {
        let html = `<li id="li-${tag.name}">${tag.name} <button id="btn-${tag.name}">X</button></li>`;
        tagHtml.push(html);
      });
      tagContainer.innerHTML = tagHtml.join("");
      tags.forEach((tag) => {
        document.getElementById(`btn-${tag.name}`)
          .addEventListener('click', async event => {
            event.preventDefault();
            try {
              const res = await fetch(`/api/tags/${tag.name}`, {
                method: 'DELETE',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: tag.name }),
              });
              let { name } = await res.json();
              console.log("json back", name);
              const li = document.getElementById(`li-${name}`);
              tagContainer.removeChild(li);
            } catch (e) {
              console.error(e);
            }
          });
      });
    } catch (e) {
      console.error(e);
    }
  }

  populateTags();
  // Get the modal
  const modal = document.getElementById("myModal");

  // Get the button that opens the modal
  const addTagBtn = document.getElementById("addTagBtn");
  const addListBtn = document.getElementById("addListBtn");

  const btn = document.getElementById('addTag');

  btn.addEventListener('click', async event => {
    event.preventDefault();
    const inputName = document.getElementById('inputName');
    const value = inputName.value;
    const nameToSend = { name: value };
    populateTags({
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nameToSend),
    });
    inputName.value = "";
    modal.style.display = "none";
  });

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

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
