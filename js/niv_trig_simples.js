function trocarFormato() {
    const formato = document.getElementById('formatoAngulo').value;
    document.getElementById('inputDecimal').style.display = (formato === 'decimal') ? 'block' : 'none';
    document.getElementById('inputGMS').style.display = (formato === 'gms') ? 'block' : 'none';
  }

  function obterAnguloEmGraus() {
    const formato = document.getElementById('formatoAngulo').value;
    if (formato === 'decimal') {
      const dec = parseFloat(document.getElementById('anguloZenitalDecimal').value);
      return isNaN(dec) ? null : dec;
    } else {
      const g = parseFloat(document.getElementById('graus').value) || 0;
      const m = parseFloat(document.getElementById('minutos').value) || 0;
      const s = parseFloat(document.getElementById('segundos').value) || 0;
      return g + (m / 60) + (s / 3600);
    }
  }

  function calcularDesnivel() {
    const hi = parseFloat(document.getElementById('alturaEstacao').value);
    const ha = parseFloat(document.getElementById('alturaAlvo').value);
    const Zgraus = obterAnguloEmGraus();
    const D = parseFloat(document.getElementById('distInclinada').value);
    const CA = parseFloat(document.getElementById('cotaEstacao').value); // agora opcional
    const aplicarRefra = document.getElementById('corrRefra').checked;
    const aplicarEsfer = document.getElementById('corrEsfer').checked;

    const resultado = document.getElementById('resultado');
    const detalhes = document.getElementById('detalhes');
    detalhes.innerHTML = '';

    if ([hi, ha, Zgraus, D].some(val => isNaN(val))) {
      resultado.textContent = "Por favor preencha todos os campos obrigatórios.";
      return;
    }

    const Zrad = Zgraus * Math.PI / 180;
    const DH = D * Math.sin(Zrad);
    let deltaH = D * Math.cos(Zrad) + hi - ha;

    const R = 6370000;
    let deltaR = 0, omega = 0, epsilon = 0;

    if (aplicarRefra) {
      deltaR = 0.14 * Math.pow(DH, 2) / (2 * R);
      deltaH -= deltaR;
    }

    if (aplicarEsfer) {
      omega = Math.pow(DH, 2) / (2 * R);
      deltaH += omega;
    }

    if (aplicarRefra && aplicarEsfer) {
      epsilon = omega - deltaR;
    }

    let output = `Δh = ${deltaH.toFixed(4)} m`;
    if (!isNaN(CA)) {
      const CB = CA + deltaH;
      if (document.getElementById('incluirIncerteza').checked) {
        const erroAnguloSeg = parseFloat(document.getElementById('erroAngulo').value) || 0;
        const erroDistMM = parseFloat(document.getElementById('erroDistancia').value) || 0;
        const ppm = parseFloat(document.getElementById('ppm').value) || 0;
        const erroAlt = parseFloat(document.getElementById('erroAlturas').value) || 0;
        const erroCA = !isNaN(CA) ? 0.005 : 0; // exemplo fixo de incerteza da cota de estação
      
        const erroDist = Math.sqrt(Math.pow(erroDistMM / 1000, 2) + Math.pow((D * ppm / 1e6), 2));
        const erroAnguloRad = (erroAnguloSeg / 3600) * (Math.PI / 180);
        const erroZ = Math.abs(D * Math.sin(Zrad) * erroAnguloRad);
      
        const erroDeltaH = Math.sqrt(
          Math.pow(erroDist * Math.cos(Zrad), 2) +
          Math.pow(erroZ, 2) +
          Math.pow(erroAlt * Math.sqrt(2), 2)
        );
      
        const erroCB = Math.sqrt(Math.pow(erroDeltaH, 2) + Math.pow(erroCA, 2));
      
        output += ` ± ${erroCB.toFixed(4)} m`;
        detalhes.innerHTML += `<li class="list-group-item">Incerteza na cota visada: ±${erroCB.toFixed(4)} m</li>`;
      }
      
      output += ` | Cota do ponto visado (CB) = ${CB.toFixed(4)} m`;
    }

    resultado.textContent = output;

    detalhes.innerHTML = `
      <li class="list-group-item">Distância Horizontal (DH): ${DH.toFixed(4)} m</li>
      ${aplicarRefra ? `<li class="list-group-item">Correção refração (Δr): ${deltaR.toFixed(6)} m</li>` : ''}
      ${aplicarEsfer ? `<li class="list-group-item">Correção esfericidade (Ω): ${omega.toFixed(6)} m</li>` : ''}
      ${(aplicarRefra && aplicarEsfer) ? `<li class="list-group-item">Correção combinada (ε): ${epsilon.toFixed(6)} m</li>` : ''}
    `;

    const formula = `Δh = ${D.toFixed(3)} × cos(${Zgraus.toFixed(4)}°) + ${hi.toFixed(3)} - ${ha.toFixed(3)}
    ⇒ Δh = ${(D * Math.cos(Zrad)).toFixed(4)} + ${(hi - ha).toFixed(4)}
    ⇒ Δh = ${deltaH.toFixed(4)} m`;

    document.getElementById('formula').textContent = formula;
  }