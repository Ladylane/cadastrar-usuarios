import { clearErrors, displayErrors } from './utils.js';

document
  .getElementById('registerForm')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const registerData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      passwordConfirm: formData.get('passwordConfirm'),
      address: {
        street: formData.get('street'),
        number: formData.get('number'),
        complement: formData.get('complement'),
        neighborhood: formData.get('neighborhood'),
        city: formData.get('city'),
        state: formData.get('state'),
        country: formData.get('country'),
        cep: formData.get('cep'),
      },
    };

    // Clear previous errors
    clearErrors();

    // Register user
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3002/register', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 201) {
          alert('User registered successfully');
          // Redirect to login page or perform other actions
          window.location.href = 'login.html';
        } else {
          const errorData = JSON.parse(xhr.responseText);
          displayErrors(errorData.message);
        }
      }
    };

    xhr.send(JSON.stringify(registerData));
  });

document
  .querySelector('input[name="cep"]')
  .addEventListener('input', function (event) {
    const cep = event.target.value.replace(/\D/g, '');

    if (cep.length === 8) {
    // Fetch address by CEP
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:3002/address?cep=${cep}`, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const addressData = JSON.parse(xhr.responseText);
          document.querySelector('input[name="street"]').value = addressData.street;
          document.querySelector('input[name="neighborhood"]').value = addressData.neighborhood;
          document.querySelector('input[name="city"]').value = addressData.city;
          document.querySelector('input[name="state"]').value = addressData.state;
          document.querySelector('input[name="country"]').value = addressData.country;
          clearErrors();
        } else {
          clearErrors();
          clearAddressFields();
          displayErrors('O endereço não foi encontrado para o CEP informado');
        }
      }
    };

    xhr.send();}
  });

function clearAddressFields() {
  document.querySelector('input[name="street"]').value = '';
  document.querySelector('input[name="neighborhood"]').value = '';
  document.querySelector('input[name="city"]').value = '';
  document.querySelector('input[name="state"]').value = '';
  document.querySelector('input[name="country"]').value = '';
  document.querySelector('input[name="number"]').value = '';
  document.querySelector('input[name="complement"]').value = '';
}