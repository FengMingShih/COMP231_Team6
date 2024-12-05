document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskModal = document.getElementById('task-modal');
    const taskTable = document.getElementById('tasks-table');
    const taskContainer = document.getElementById('tasks-container');
    const addTaskBtn = document.getElementById('add-task-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const taskIdInput = document.getElementById('taskId');  // Hidden field for task ID
  
    // Function to fetch and display tasks
    async function fetchTasks() {
      try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    }
  
    // Function to render tasks in the table
    function renderTasks(tasks) {
      taskContainer.innerHTML = '';
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
        taskContainer.appendChild(row);
      });
  
      // Add event listeners to edit and delete buttons
      const editButtons = document.querySelectorAll('.edit-btn');
      const deleteButtons = document.querySelectorAll('.delete-btn');
  
      editButtons.forEach(button => {
        button.addEventListener('click', handleEdit);
      });
  
      deleteButtons.forEach(button => {
        button.addEventListener('click', handleDelete);
      });
    }
  
    // Function to handle editing a task
    async function handleEdit(e) {
      const taskId = e.target.dataset.id;
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        const task = await response.json();
        // Fill the form with task data for editing
        document.getElementById('taskTitle').value = task.taskTitle;
        document.getElementById('assignedTo').value = task.assignedTo;
        document.getElementById('taskContent').value = task.taskContent;
        document.getElementById('estimatedTime').value = new Date(task.estimatedTime).toISOString().slice(0, 16);
        taskIdInput.value = task._id;  // Set the hidden task ID field
        taskModal.style.display = 'block';
      } catch (err) {
        console.error('Error fetching task:', err);
      }
    }
  
    // Function to handle deleting a task
    async function handleDelete(e) {
      const taskId = e.target.dataset.id;
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
        fetchTasks();  // Re-fetch tasks after deletion
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  
    // Function to handle form submission (add or update a task)
    taskForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const taskId = taskIdInput.value;
      const taskData = {
        taskTitle: document.getElementById('taskTitle').value,
        assignedTo: document.getElementById('assignedTo').value,
        taskContent: document.getElementById('taskContent').value,
        estimatedTime: document.getElementById('estimatedTime').value,
      };
  
      const method = taskId ? 'PUT' : 'POST';
      const url = taskId ? `/api/tasks/${taskId}` : '/api/tasks';
  
      try {
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData),
        });
  
        if (response.ok) {
          fetchTasks();  // Re-fetch tasks after adding or updating
          taskModal.style.display = 'none';  // Close modal
        }
      } catch (err) {
        console.error('Error saving task:', err);
      }
    });
  
    // Open the modal for adding a new task
    addTaskBtn.addEventListener('click', function () {
      taskModal.style.display = 'block';
      document.getElementById('task-form').reset();  // Reset the form
      taskIdInput.value = '';  // Reset hidden task ID
      document.getElementById('modal-title').textContent = 'Add New Task';  // Change modal title
    });
  
    // Close the modal
    closeModalBtn.addEventListener('click', function () {
      taskModal.style.display = 'none';
    });
  
    // Fetch tasks on page load
    fetchTasks();
  });

  // new