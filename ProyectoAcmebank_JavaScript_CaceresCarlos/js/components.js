class TarjetaResumen extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 16px;
          font-family: sans-serif;
        }
      </style>
      <div class="card">
        <h3>Resumen de Cuenta</h3>
        <p><strong>Cuenta:</strong> <span id="cuenta"></span></p>
        <p><strong>Saldo:</strong> $<span id="saldo"></span></p>
        <p><strong>Fecha:</strong> <span id="fecha"></span></p>
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#cuenta").textContent = this.getAttribute("cuenta");
    this.shadowRoot.querySelector("#saldo").textContent = this.getAttribute("saldo");
    this.shadowRoot.querySelector("#fecha").textContent = this.getAttribute("fecha");
  }
}

customElements.define('tarjeta-resumen', TarjetaResumen);
