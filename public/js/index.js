const tasksContainer = document.getElementById('tasks-container');
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const closeModalButton = document.getElementById('close-modal');
const addTaskButton = document.getElementById('add-task-btn');

let currentTaskId = null; // To track the task being edited

// Fetch all tasks and display them in the table
async function fetchTasks() {
  const response = await fetch('/api/tasks');
  const tasks = await response.json();
  tasksContainer.innerHTML = ''; // Clear the table body

  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.taskTitle}</td>
      <td>${task.assignedTo}</td>
      <td>${task.taskContent}</td>
      <td>${new Date(task.estimatedTime).toLocaleString()}</td>
      <td>
        <button class="edit-btn" data-id="${task._id}">Edit</button>
        <button class="delete-btn" data-id="${task._id}">Delete</button>
      </td>
    `;
    tasksContainer.appendChild(row);
  });
}

if (addTaskButton) {
// Handle form submission for adding or editing tasks
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskTitle = document.getElementById('taskTitle').value;
  const assignedTo = document.getElementById('assignedTo').value;
  const taskContent = document.getElementById('taskContent').value;
  const estimatedTime = document.getElementById('estimatedTime').value;

  const taskData = { taskTitle, assignedTo, taskContent, estimatedTime };

  if (currentTaskId) {
    // Update task
    await fetch(`/api/tasks/${currentTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
  } else {
    // Create task
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
  }

  taskModal.style.display = 'none';
  fetchTasks(); // Refresh the task list
});

// Open modal for adding a new task
addTaskButton.addEventListener('click', () => {
  modalTitle.textContent = 'Add New Task';
  currentTaskId = null; // Clear currentTaskId
  taskForm.reset();
  taskModal.style.display = 'block';
});

// Open modal for editing a task
tasksContainer.addEventListener('click', async (e) => {
  if (e.target.classList.contains('edit-btn')) {
    const taskId = e.target.getAttribute('data-id');
    const response = await fetch(`/api/tasks/${taskId}`);
    const task = await response.json();

    document.getElementById('taskTitle').value = task.taskTitle;
    document.getElementById('assignedTo').value = task.assignedTo;
    document.getElementById('taskContent').value = task.taskContent;
    document.getElementById('estimatedTime').value = new Date(task.estimatedTime).toISOString().slice(0, -1);

    modalTitle.textContent = 'Edit Task';
    currentTaskId = taskId; // Set the currentTaskId
    taskModal.style.display = 'block';
  }
});

// Handle task deletion
tasksContainer.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const taskId = e.target.getAttribute('data-id');
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    fetchTasks(); // Refresh the task list
  }
});

// Close the modal
closeModalButton.addEventListener('click', () => {
  taskModal.style.display = 'none';
});

// Fetch tasks when the page loads
fetchTasks();
}