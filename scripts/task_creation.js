document.getElementById('taskForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const taskName = document.getElementById('taskName').value;
    const assignee = document.getElementById('assignee').value;
  
    console.log(`Task Created: ${taskName}, Assigned to: ${assignee}`);
  
    alert('Task created successfully!');
  });

 
