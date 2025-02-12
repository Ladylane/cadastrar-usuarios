document.addEventListener('DOMContentLoaded', async function () {
  const userTableBody = document.querySelector('#userTable tbody');

  try {
    const response = await fetch('http://localhost:3002/users', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });

    if (response.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = 'login.html';
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();
    users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          ${user.address.street},
          ${user.address.number}, 
          ${user.address.complement ? user.address.complement + ',' : ''}
          ${user.address.neighborhood},
          ${user.address.cep},
          ${user.address.city}, 
          ${user.address.state}, 
          ${user.address.country} 
        </td>
      `;
      userTableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});
