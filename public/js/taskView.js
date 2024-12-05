document.addEventListener('DOMContentLoaded', function() {
    // Ensure the page content is fully loaded before running the script

    const taskListElement = document.getElementById('task-list');  // Assuming 'task-list' is the ID of your container

    if (!taskListElement) {
        console.error('The task list element was not found on the page.');
        return;
    }

    // Fetch tasks from the server
    fetch('/api/tasks')
        .then(response => response.json())
        .then(tasks => {
            // Check if tasks are returned
            if (tasks.length > 0) {
                taskListElement.innerHTML = '';  // Clear existing content
                tasks.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `
                        <h3>${task.title}</h3>
                        <p><strong>Assigned to:</strong> ${task.assignedTo}</p>
                        <p><strong>Estimated Completion Time:</strong> ${task.estimatedCompletionTime}</p>
                        <p><strong>Content:</strong> ${task.content}</p>
                    `;
                    taskListElement.appendChild(taskElement);
                });
            } else {
                taskListElement.innerHTML = 'No tasks available.';
            }
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            taskListElement.innerHTML = 'Failed to load tasks.';
        });
});
