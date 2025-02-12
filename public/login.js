import { displayErrors } from './utils.js';

document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const loginData = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    // Clear previous errors
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';

    // Login user
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3002/auth/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          localStorage.setItem('jwtToken', data.access_token);
          // Redirect to list-users page
          window.location.href = 'list-users.html';
        } else {
          const errorData = JSON.parse(xhr.responseText);
          displayErrors(errorData.message);
        }
      }
    };

    xhr.send(JSON.stringify(loginData));
  });

document
  .getElementById('forgotPasswordLink')
  .addEventListener('click', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    // Clear previous errors
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'none';

    if (!email) {
      displayErrors('Por favor insira seu email.');
      return;
    }

    // Request password reset
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3002/auth/request-password-reset', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Redirect to reset-password page
          window.location.href = 'reset-password.html';
        } else {
          const errorData = JSON.parse(xhr.responseText);
          displayErrors(errorData.message);
        }
      }
    };

    xhr.send(JSON.stringify({ email }));
  });