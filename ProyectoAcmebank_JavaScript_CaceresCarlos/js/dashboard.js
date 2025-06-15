document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

  if (!usuario) {
    alert("Debe iniciar sesión.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nombreUsuario").textContent = `${usuario.nombres} ${usuario.apellidos}`;
  mostrarResumen(usuario);

  // CONSIGNACIÓN
  document.getElementById("formConsignacion").addEventListener("submit", async function(e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("montoConsignar").value);
    if (isNaN(monto) || monto <= 0) return alert("Ingrese un valor válido.");

    const transaccion = crearTransaccion("Consignación", "Consignación por canal electrónico", monto);
    usuario.cuenta.saldo += monto;

    usuario.cuenta.transacciones ||= [];
    usuario.cuenta.transacciones.push(transaccion);

    await guardarUsuario(usuario);
  });

  // RETIRO
  document.getElementById("formRetiro").addEventListener("submit", async function(e) {
    e.preventDefault();
    const monto = parseFloat(document.getElementById("montoRetirar").value);
    if (isNaN(monto) || monto <= 0) return alert("Ingrese un valor válido.");
    if (monto > usuario.cuenta.saldo) return alert("Saldo insuficiente.");

    const transaccion = crearTransaccion("Retiro", "Retiro de dinero", monto);
    usuario.cuenta.saldo -= monto;

    usuario.cuenta.transacciones ||= [];
    usuario.cuenta.transacciones.push(transaccion);


