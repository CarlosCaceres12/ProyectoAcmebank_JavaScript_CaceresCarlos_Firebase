document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const tipoId = document.getElementById('tipoId').value;
  const numeroId = document.getElementById('numeroId').value;
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('usuarios')) || [];
  const user = users.find(u => u.tipoId === tipoId && u.numeroId === numeroId && u.password === password);

  if (user) {
    localStorage.setItem('usuarioActivo', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    document.getElementById('mensajeError').textContent = 'Credenciales incorrectas';
  }
});
