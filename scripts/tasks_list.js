// scripts/tasks_list.js
window.onload = async function() {
    // Fetch the list of tasks from the server
    try {
        const response = await fetch('http://localhost:3000/tasks'); // Update with your server URL
        const tasks = await response.json();

        // Get the table body element
        const tasksList = document.getElementById('tasks-list');
        tasksList.innerHTML = ''; // Clear any existing rows

        // Loop through the tasks and create table rows
        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.taskName}</td>
                <td>${task.description}</td>
                <td>${task.assignee}</td>
                <td>${task.status}</td>
                <td>${task.deadline}</td>
            `;
            tasksList.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
};
