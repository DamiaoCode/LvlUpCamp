// js/niv_trig_tabela.js

function adicionarPonto() {
    const tbody = document.querySelector('#tabelaPontos tbody');
    const row = document.createElement('tr');
  
    row.innerHTML = `
      <td><input type="text" class="form-control ponto" placeholder="Ponto"></td>
      <td><input type="number" class="form-control cota" step="0.001" placeholder="Cota"></td>
      <td><input type="text" class="form-control visado" placeholder="Ponto Visado"></td>
      <td><input type="number" class="form-control hi" step="0.001" placeholder="hi"></td>
      <td><input type="number" class="form-control ha" step="0.001" placeholder="ha"></td>
      <td><input type="number" class="form-control distancia" step="0.001" placeholder="D'"></td>
      <td>
        <div class="input-group mb-1">
          <input type="number" class="form-control angulo" placeholder="Ângulo" step="0.0001">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Graus</button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" data-tipo="graus">Graus</a></li>
            <li><a class="dropdown-item" href="#" data-tipo="grados">Grados</a></li>
            <li><a class="dropdown-item" href="#" data-tipo="radianos">Radianos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" data-tipo="gms">Graus, Min, Seg</a></li>
          </ul>
        </div>
        <div class="gms-inputs d-none">
          <input type="number" class="form-control grau" placeholder="G">
          <input type="number" class="form-control minuto" placeholder="M">
          <input type="number" class="form-control segundo" placeholder="S" step="0.01">
        </div>
        <input type="hidden" class="tipo-angulo" value="graus">
      </td>
      <td class="resultado-dh">—</td>
      <td class="cota-visado">—</td>
    `;
  
    tbody.appendChild(row);
    configurarDropdowns(row);
  }
  
  function visarNovoPonto() {
    const tbody = document.querySelector('#tabelaPontos tbody');
    const ultimaLinha = tbody.lastElementChild;
    if (!ultimaLinha) return;
  
    const ponto = ultimaLinha.querySelector('.ponto').value;
    const cota = ultimaLinha.querySelector('.cota').value;
    const hi = ultimaLinha.querySelector('.hi').value;
  
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input type="text" class="form-control ponto" value="${ponto}" readonly></td>
      <td><input type="number" class="form-control cota" value="${cota}" readonly></td>
      <td><input type="text" class="form-control visado" placeholder="Ponto Visado"></td>
      <td><input type="number" class="form-control hi" value="${hi}" step="0.001"></td>
      <td><input type="number" class="form-control ha" step="0.001"></td>
      <td><input type="number" class="form-control distancia" step="0.001"></td>
      <td>
        <div class="input-group mb-1">
          <input type="number" class="form-control angulo" placeholder="Ângulo" step="0.0001">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">Graus</button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#" data-tipo="graus">Graus</a></li>
            <li><a class="dropdown-item" href="#" data-tipo="grados">Grados</a></li>
            <li><a class="dropdown-item" href="#" data-tipo="radianos">Radianos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" data-tipo="gms">Graus, Min, Seg</a></li>
          </ul>
        </div>
        <div class="gms-inputs d-none">
          <input type="number" class="form-control grau" placeholder="G">
          <input type="number" class="form-control minuto" placeholder="M">
          <input type="number" class="form-control segundo" placeholder="S" step="0.01">
        </div>
        <input type="hidden" class="tipo-angulo" value="graus">
      </td>
      <td class="resultado-dh">—</td>
      <td class="cota-visado">—</td>
    `;
  
    tbody.appendChild(row);
    configurarDropdowns(row);
  }
  
  function configurarDropdowns(row) {
    row.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const tipo = this.getAttribute('data-tipo');
        const td = this.closest('td');
        const btn = td.querySelector('.dropdown-toggle');
        const hiddenInput = td.querySelector('.tipo-angulo');
        const inputDecimal = td.querySelector('.angulo');
        const inputGMS = td.querySelector('.gms-inputs');
  
        hiddenInput.value = tipo;
        btn.textContent = this.textContent;
  
        if (tipo === 'gms') {
          inputDecimal.classList.add('d-none');
          inputGMS.classList.remove('d-none');
        } else {
          inputDecimal.classList.remove('d-none');
          inputGMS.classList.add('d-none');
        }
      });
    });
  }
  
  function calcularTabela() {
    const rows = document.querySelectorAll('#tabelaPontos tbody tr');
    const cotas = {};
  
    rows.forEach(row => {
      const ponto = row.querySelector('.ponto').value.trim();
      const visado = row.querySelector('.visado').value.trim();
      const hi = parseFloat(row.querySelector('.hi').value);
      const ha = parseFloat(row.querySelector('.ha').value);
      const D = parseFloat(row.querySelector('.distancia').value);
  
      let Z;
      const tipoAngulo = row.querySelector('.tipo-angulo').value;
      if (tipoAngulo === 'gms') {
        const g = parseFloat(row.querySelector('.grau')?.value) || 0;
        const m = parseFloat(row.querySelector('.minuto')?.value) || 0;
        const s = parseFloat(row.querySelector('.segundo')?.value) || 0;
        Z = (g + m / 60 + s / 3600) * Math.PI / 180;
      } else {
        let valor = parseFloat(row.querySelector('.angulo').value);
        if (tipoAngulo === 'graus') Z = valor * Math.PI / 180;
        else if (tipoAngulo === 'grados') Z = valor * Math.PI / 200;
        else Z = valor;
      }
  
      const resultCell = row.querySelector('.resultado-dh');
      const cotaVisadoCell = row.querySelector('.cota-visado');
      const cotaOrigem = parseFloat(row.querySelector('.cota').value);
  
      if ([hi, ha, D, Z].some(val => isNaN(val)) || isNaN(cotaOrigem)) {
        resultCell.textContent = "⚠️";
        cotaVisadoCell.textContent = "—";
        return;
      }
  
      const deltaH = D * Math.cos(Z) + hi - ha;
      resultCell.textContent = deltaH.toFixed(4) + ' m';
  
      const cotaVisado = cotaOrigem + deltaH;
      if (visado) {
        cotas[visado] = cotaVisado;
      }
      cotaVisadoCell.textContent = cotaVisado.toFixed(3);
    });
  }
  