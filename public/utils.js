export const displayErrors = (errors) => {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.style.display = 'block';
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      const errorElement = document.createElement('p');
      errorElement.textContent = error;
      errorContainer.appendChild(errorElement);
    });
  } else {
    const errorElement = document.createElement('p');
    errorElement.textContent = errors;
    errorContainer.appendChild(errorElement);
  }
};

export const clearErrors = () => {
  const errorContainer = document.getElementById('errorContainer');
  errorContainer.innerHTML = '';
  errorContainer.style.display = 'none';
};
