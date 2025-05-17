let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let filter = "all"; // Possible values: 'all', 'complete', 'incomplete'

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function setFilter(newFilter) {
      filter = newFilter;

      // Update active button styling

      document.querySelectorAll(".filter-buttons button").forEach(btn => {
        btn.classList.remove("active");
      });
      if (filter === "all") {
        document.getElementById("filterAll").classList.add("active");
      } else if (filter === "complete") {
        document.getElementById("filterComplete").classList.add("active");
      } else if (filter === "incomplete") {
        document.getElementById("filterIncomplete").classList.add("active");
      }

      renderTasks();
    }

    function renderTasks() {
      const incompleteContainer = document.getElementById("incompleteTasks");
      const completeContainer = document.getElementById("completeTasks");

      incompleteContainer.innerHTML = "";
      completeContainer.innerHTML = "";

      tasks.forEach((task, index) => {
        // Apply filter
        if (
          (filter === "complete" && !task.completed) ||
          (filter === "incomplete" && task.completed)
        ) {
          // Skip tasks not matching filter
          return;
        }

        const taskEl = document.createElement("div");
        taskEl.className = "task";
        taskEl.draggable = true;
        taskEl.ondragstart = (e) => drag(e, index);

        if (task.editing) {
          taskEl.innerHTML = `
            <input type="text" id="editTitle${index}" value="${task.title}" />
            <textarea id="editDesc${index}">${task.description}</textarea>
            <button onclick="saveEdit(${index})">Save</button>
            <button onclick="cancelEdit(${index})">Cancel</button>
          `;
        } else {
          taskEl.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <button onclick="startEdit(${index})">Edit</button>
            <button onclick="deleteTask(${index})">Delete</button>
          `;
        }

        if (task.completed) {
          completeContainer.appendChild(taskEl);
        } else {
          incompleteContainer.appendChild(taskEl);
        }
      });

      // Hide/show sections depending on filter and content
      document.getElementById("incomplete").style.display =
        filter === "complete" ? "none" : "block";
      document.getElementById("complete").style.display =
        filter === "incomplete" ? "none" : "block";
    }

    function addTask() {
      const title = document.getElementById("title").value.trim();
      const description = document.getElementById("description").value.trim();

      if (title === "" || description === "")
        return alert("Please enter both title and description.");

      tasks.push({ title, description, completed: false, editing: false });
      saveTasks();
      renderTasks();
      document.getElementById("title").value = "";
      document.getElementById("description").value = "";
    }

    function startEdit(index) {
      tasks[index].editing = true;
      renderTasks();
    }

    function cancelEdit(index) {
      tasks[index].editing = false;
      renderTasks();
    }

    function saveEdit(index) {
      const newTitle = document.getElementById(`editTitle${index}`).value.trim(); 
       const newDesc = document.getElementById(`editDesc${index}`).value.trim();
         if (newTitle === "" || newDesc === "") {
    return alert("Both fields are required.");
  }

  tasks[index].title = newTitle;
  tasks[index].description = newDesc;
  tasks[index].editing = false;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// Drag & Drop Functions
let draggedIndex = null;

function drag(e, index) {
  draggedIndex = index;
  e.dataTransfer.effectAllowed = "move";
}

function allowDrop(e) {
  e.preventDefault();
}

function drop(e, markComplete) {
  e.preventDefault();
  if (draggedIndex === null) return;

  tasks[draggedIndex].completed = markComplete;
  saveTasks();
  renderTasks();
  draggedIndex = null;
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Initial render
renderTasks(); 
