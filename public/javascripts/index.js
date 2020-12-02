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

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  var btn1 = document.getElementById("myBtn1");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal 
  btn.onclick = function () {
    modal.style.display = "block";
  }
  btn1.onclick = function () {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function (event) {
  //   if (event.target == modal) {
  //     modal.style.display = "none";
  //   }
  // }
});
