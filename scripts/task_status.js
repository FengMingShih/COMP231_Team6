document.getElementById('statusForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const taskId = document.getElementById('taskId').value;
    const status = document.getElementById('status').value;
  
    console.log(`Task ID: ${taskId}, Updated Status: ${status}`);
  
    alert('Task status updated successfully!');
  });
  