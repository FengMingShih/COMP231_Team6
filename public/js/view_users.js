document.addEventListener('DOMContentLoaded', function() {
    const userTable = document.getElementById('user-table');
    const addUserButton = document.getElementById('add-user-btn');
    const userFormContainer = document.getElementById('user-form-container');
    const userForm = document.getElementById('user-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const submitBtn = document.getElementById('submit-btn');
  
    // Fetch users and display them in the table
    async function fetchUsers() {
      const response = await fetch('/api/users');
      const users = await response.json();
      userTable.innerHTML = ''; // Clear existing rows
  
      users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${user._id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td>${new Date(user.createdAt).toLocaleString()}</td>
          <td>
            <button onclick="editUser('${user._id}')">Edit</button>
            <button onclick="deleteUser('${user._id}')">Delete</button>
          </td>
        `;
        userTable.appendChild(row);
      });
    }
  
    // Add New User
    addUserButton.addEventListener('click', function() {
      userForm.reset();
      document.getElementById('form-title').textContent = 'Add New User';
      userFormContainer.style.display = 'block';
      submitBtn.textContent = 'Add User';
    });
  
    // Edit User
    window.editUser = function(id) {
      fetch(`/api/users/${id}`)
        .then(response => response.json())
        .then(user => {
          document.getElementById('user-id').value = user._id;
          document.getElementById('username').value = user.username;
          document.getElementById('email').value = user.email;
          document.getElementById('role').value = user.role;
          document.getElementById('form-title').textContent = 'Edit User';
          userFormContainer.style.display = 'block';
          submitBtn.textContent = 'Update User';
        })
        .catch(error => console.error('Error fetching user:', error));
    };
  
    // Delete User
    window.deleteUser = function(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/api/users/${id}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            fetchUsers(); // Refresh user list
          } else {
            alert('Error deleting user');
          }
        });
      }
    };
  
    // Submit the form (Add or Edit User)
    userForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const userId = document.getElementById('user-id').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const role = document.getElementById('role').value;
  
      const userData = {
        username,
        email,
        role
      };
  
      const method = userId ? 'PUT' : 'POST';
      const url = userId ? `/api/users/${userId}` : '/api/users';
  
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => {
        if (response.ok) {
          fetchUsers(); // Refresh user list
          userFormContainer.style.display = 'none'; // Hide form
        } else {
          alert('Error saving user');
        }
      })
      .catch(error => console.error('Error saving user:', error));
    });
  
    // Cancel form (close the form without saving)
    cancelBtn.addEventListener('click', function() {
      userFormContainer.style.display = 'none';
    });
  
    // Initially fetch users
    fetchUsers();
  });
  