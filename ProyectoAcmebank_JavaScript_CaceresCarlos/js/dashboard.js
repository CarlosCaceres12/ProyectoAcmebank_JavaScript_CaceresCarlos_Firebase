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

    await guardarUsuario(usuario);
  });

  // PAGO SERVICIOS
  document.getElementById("formPagoServicios").addEventListener("submit", async function(e) {
    e.preventDefault();
    const servicio = document.getElementById("servicio").value;
    const referencia = document.getElementById("referenciaServicio").value;
    const valor = parseFloat(document.getElementById("valorServicio").value);

    if (!servicio || !referencia || isNaN(valor) || valor <= 0) {
      return alert("Complete todos los campos correctamente.");
    }
    if (valor > usuario.cuenta.saldo) return alert("Saldo insuficiente para pagar el servicio.");

    const concepto = `Pago de servicio público ${servicio}`;
    const transaccion = crearTransaccion("Retiro", concepto, valor, referencia);
    usuario.cuenta.saldo -= valor;

    usuario.cuenta.transacciones ||= [];
    usuario.cuenta.transacciones.push(transaccion);

    await guardarUsuario(usuario);
  });

  // EXTRACTO
  document.getElementById("formExtracto").addEventListener("submit", function(e) {
    e.preventDefault();
    const año = document.getElementById("añoExtracto").value;
    const mes = document.getElementById("mesExtracto").value;
    const resultado = document.getElementById("resultadoExtracto");
    const btnImprimir = document.getElementById("btnImprimirExtracto");

    resultado.innerHTML = "";
    btnImprimir.style.display = "none";

    if (!año || !mes) return alert("Debe ingresar año y mes.");

    const transacciones = usuario.cuenta.transacciones || [];
    const filtradas = transacciones.filter(tx => {
      const [añoTx, mesTx] = tx.fecha.split("-");
      return añoTx === año && mesTx === mes;
    });

    if (filtradas.length === 0) {
      resultado.innerHTML = "<p>No hay movimientos para ese periodo.</p>";
      return;
    }

    let html = `<h3>Movimientos del ${mes}/${año}</h3>
    <table border="1" cellpadding="5">
      <tr><th>Fecha</th><th>Referencia</th><th>Tipo</th><th>Concepto</th><th>Valor</th></tr>`;
    filtradas.forEach(tx => {
      html += `<tr>
        <td>${tx.fecha}</td>
        <td>${tx.referencia}</td>
        <td>${tx.tipo}</td>
        <td>${tx.concepto}</td>
        <td>$${tx.valor.toLocaleString("es-CO")}</td>
      </tr>`;
    });
    html += "</table>";
    resultado.innerHTML = html;
    btnImprimir.style.display = "inline-block";
  });

  // CERTIFICADO
  const contenedorCert = document.getElementById("certificadoBancario");
  const fecha = new Date().toLocaleDateString("es-CO");
  contenedorCert.innerHTML = `
    <div class="certificado-bancario">
      <h3 class="certificado-titulo">CERTIFICADO BANCARIO</h3>
      <p>Yo, <strong>${usuario.nombres} ${usuario.apellidos}</strong>, identificado con <strong>${usuario.tipoId}</strong> No. <strong>${usuario.numeroId}</strong>, certifico que poseo una cuenta activa en el banco <strong>AcmeBank</strong> con los siguientes datos:</p>
      <ul>
        <li><strong>Número de cuenta:</strong> ${usuario.cuenta.numero}</li>
        <li><strong>Ciudad de residencia:</strong> ${usuario.ciudad}</li>
        <li><strong>Fecha de apertura:</strong> ${usuario.cuenta.fechaCreacion}</li>
        <li><strong>Saldo actual:</strong> $${usuario.cuenta.saldo.toLocaleString("es-CO")}</li>
      </ul>
      <p>Este certificado se expide a solicitud del titular en la ciudad de <strong>${usuario.ciudad}</strong> a los <strong>${fecha}</strong>.</p>
      <div class="firma">Firma: ________________________</div>
    </div>
  `;
});

function mostrarResumen(usuario) {
  document.getElementById("resumenCuenta").innerHTML = `
    <p><strong>Número de cuenta:</strong> ${usuario.cuenta.numero}</p>
    <p><strong>Saldo actual:</strong> $${usuario.cuenta.saldo}</p>
    <p><strong>Fecha de creación:</strong> ${usuario.cuenta.fechaCreacion}</p>
  `;
}

function crearTransaccion(tipo, concepto, valor, referenciaManual = null) {
  return {
    fecha: new Date().toISOString().split("T")[0],
    referencia: referenciaManual || "REF" + Math.floor(Math.random() * 1000000),
    tipo,
    concepto,
    valor
  };
}

async function guardarUsuario(usuario) {
  try {
    await db.ref("usuarios/" + usuario.numeroId).set(usuario);
    localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
    alert("Operación realizada con éxito.");
    location.reload();
  } catch (err) {
    alert("Error al guardar: " + err.message);
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "login.html";
}

function imprimirCertificado() {
  const contenido = document.getElementById("certificadoBancario").innerHTML;
  const ventana = window.open('', '', 'height=600,width=800');
  ventana.document.write(`
    <html>
      <head>
        <title>Certificado Bancario</title>
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            padding: 40px;
            color: #333;
            line-height: 1.6;
          }
          h3 {
            text-align: center;
            font-size: 20px;
            color: #003366;
            margin-bottom: 30px;
          }
          ul {
            margin-top: 10px;
            padding-left: 20px;
          }
          li {
            margin-bottom: 8px;
          }
          .firma {
            margin-top: 50px;
            font-style: italic;
          }
        </style>
      </head>
      <body>${contenido}</body>
    </html>
  `);
  ventana.document.close();
  ventana.focus();
  ventana.print();
  ventana.close();
}
