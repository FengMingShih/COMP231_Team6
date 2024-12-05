document.addEventListener('DOMContentLoaded', () => {
    // Fetch tasks when the page loads
    fetch('/api/tasks')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching tasks: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        const tasksContainer = document.getElementById('tasks-container');
        // Clear any existing tasks in the container
        tasksContainer.innerHTML = '';
        data.forEach(task => {
          const taskRow = document.createElement('tr');
          taskRow.innerHTML = `
            <td>${task.taskTitle}</td>
            <td>${task.assignedTo}</td>
            <td>${task.taskContent}</td>
            <td>${new Date(task.estimatedTime).toLocaleString()}</td>
            <td>
              <button onclick="editTask('${task._id}')">Edit</button>
              <button onclick="deleteTask('${task._id}')">Delete</button>
            </td>
          `;
          tasksContainer.appendChild(taskRow);
        });
      })
      .catch(error => {
        console.error('Error fetching tasks:', error);
        // Display error message to the user
        const tasksContainer = document.getElementById('tasks-container');
        tasksContainer.innerHTML = '<tr><td colspan="5">Error fetching tasks. Please try again later.</td></tr>';
      });
  
    // Handle task creation
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const taskTitle = document.getElementById('taskTitle').value;
      const assignedTo = document.getElementById('assignedTo').value;
      const taskContent = document.getElementById('taskContent').value;
      const estimatedTime = document.getElementById('estimatedTime').value;
  
      const taskData = {
        taskTitle,
        assignedTo,
        taskContent,
        estimatedTime
      };
  
      fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })
        .then(response => response.json())
        .then(data => {
          // Add the new task to the table
          const taskRow = document.createElement('tr');
          taskRow.innerHTML = `
            <td>${data.taskTitle}</td>
            <td>${data.assignedTo}</td>
            <td>${data.taskContent}</td>
            <td>${new Date(data.estimatedTime).toLocaleString()}</td>
            <td>
              <button onclick="editTask('${data._id}')">Edit</button>
              <button onclick="deleteTask('${data._id}')">Delete</button>
            </td>
          `;
          document.getElementById('tasks-container').appendChild(taskRow);
  
          // Clear the form fields
          taskForm.reset();
          // Close the modal
          document.getElementById('task-modal').style.display = 'none';
        })
        .catch(error => {
          console.error('Error creating task:', error);
          alert('Failed to create task');
        });
    });
  });
  
  // Edit task function
  function editTask(taskId) {
    // Fetch task data by ID for editing (add an endpoint to handle this)
    fetch(`/api/tasks/${taskId}`)
      .then(response => response.json())
      .then(data => {
        document.getElementById('taskTitle').value = data.taskTitle;
        document.getElementById('assignedTo').value = data.assignedTo;
        document.getElementById('taskContent').value = data.taskContent;
        document.getElementById('estimatedTime').value = new Date(data.estimatedTime).toISOString().slice(0, 16);
        // Change modal title to "Edit Task"
        document.getElementById('modal-title').textContent = 'Edit Task';
        // Display the modal
        document.getElementById('task-modal').style.display = 'block';
  
        // Update the task on form submit
        const taskForm = document.getElementById('task-form');
        taskForm.onsubmit = function (event) {
          event.preventDefault();
  
          const updatedTaskData = {
            taskTitle: document.getElementById('taskTitle').value,
            assignedTo: document.getElementById('assignedTo').value,
            taskContent: document.getElementById('taskContent').value,
            estimatedTime: document.getElementById('estimatedTime').value
          };
  
          fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTaskData)
          })
            .then(response => response.json())
            .then(updatedTask => {
              // Update task in the table
              const taskRow = document.querySelector(`button[onclick="editTask('${taskId}')"]`).parentElement.parentElement;
              taskRow.innerHTML = `
                <td>${updatedTask.taskTitle}</td>
                <td>${updatedTask.assignedTo}</td>
                <td>${updatedTask.taskContent}</td>
                <td>${new Date(updatedTask.estimatedTime).toLocaleString()}</td>
                <td>
                  <button onclick="editTask('${updatedTask._id}')">Edit</button>
                  <button onclick="deleteTask('${updatedTask._id}')">Delete</button>
                </td>
              `;
  
              // Close the modal
              document.getElementById('task-modal').style.display = 'none';
            })
            .catch(error => {
              console.error('Error updating task:', error);
              alert('Failed to update task');
            });
        };
      })
      .catch(error => {
        console.error('Error fetching task:', error);
      });
  }
  
  // Delete task function
  function deleteTask(taskId) {
    fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
      .then(() => {
        // Remove the task row from the table
        const taskRow = document.querySelector(`button[onclick="deleteTask('${taskId}')"]`).parentElement.parentElement;
        taskRow.remove();
      })
      .catch(error => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      });
  }
  