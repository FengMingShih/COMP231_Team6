// Fetch users and populate the table
async function fetchUsers() {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      const userTable = document.getElementById('user-table');
  
      // Populate table rows
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user._id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${new Date(user.createdAt).toLocaleString()}</td>
        `;
        userTable.appendChild(row);
      });
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load user accounts. Please try again later.');
    }
  }
  
  // Call the function to fetch users
  fetchUsers();
  