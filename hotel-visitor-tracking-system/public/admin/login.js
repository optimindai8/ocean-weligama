const form = document.querySelector('#login-form');
const submit = document.querySelector('#submit');
const errorBox = document.querySelector('#error');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  errorBox.textContent = '';
  submit.disabled = true;

  try {
    const response = await fetch('/admin/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'hotel-admin' },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    });

    if (response.ok) {
      location.replace('/admin/');
      return;
    }
    errorBox.textContent =
      response.status === 429
        ? 'Too many attempts. Please wait a few minutes and try again.'
        : 'Incorrect username or password.';
    form.password.value = '';
    form.password.focus();
  } catch {
    errorBox.textContent = 'Could not reach the server. Please try again.';
  } finally {
    submit.disabled = false;
  }
});
