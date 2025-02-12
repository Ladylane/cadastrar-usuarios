import { displayErrors } from './utils.js';

document
  .getElementById('resetPasswordForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const resetPasswordData = {
      email: formData.get('email'),
      code: formData.get('code'),
      newPassword: formData.get('newPassword'),
    };

    // Clear previous errors
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';

    // Reset password
    const resetPasswordResponse = await fetch(
      'http://localhost:3002/auth/reset-password',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetPasswordData),
      },
    );

    if (resetPasswordResponse.ok) {
      alert('Password reset successful');
      // Redirect to login page or perform other actions
      window.location.href = 'login.html';
    } else {
      const errorData = await resetPasswordResponse.json();
      displayErrors(errorData.message);
    }
  });
