// js/niv_reciprocas.js

function trocarFormatoReciproco(idBase) {
    const select = document.getElementById(`formato_${idBase}`);
    const formato = select.value;
  
    document.getElementById(`inputDecimal_${idBase}`).style.display = formato === 'decimal' ? 'block' : 'none';
    document.getElementById(`inputGMS_${idBase}`).style.display = formato === 'gms' ? 'flex' : 'none';
  }
  
  function obterAnguloReciproco(idBase) {
    const formato = document.getElementById(`formato_${idBase}`).value;
    if (formato === 'decimal') {
      const dec = parseFloat(document.getElementById(`anguloDecimal_${idBase}`).value);
      return isNaN(dec) ? null : dec;
    } else if (formato === 'gms') {
      const g = parseFloat(document.getElementById(`graus_${idBase}`).value) || 0;
      const m = parseFloat(document.getElementById(`minutos_${idBase}`).value) || 0;
      const s = parseFloat(document.getElementById(`segundos_${idBase}`).value) || 0;
      return g + m / 60 + s / 3600;
    }
    return null;
  }
  
  function calcularReciproco() {
    const hiA = parseFloat(document.getElementById('hiA').value);
    const haB = parseFloat(document.getElementById('haB').value);
    const ZABgraus = obterAnguloReciproco('AB');
    const DAB = parseFloat(document.getElementById('DAB').value);
  
    const hiB = parseFloat(document.getElementById('hiB').value);
    const haA = parseFloat(document.getElementById('haA').value);
    const ZBAgraus = obterAnguloReciproco('BA');
    const DBA = parseFloat(document.getElementById('DBA').value);
  
    const resultado = document.getElementById('resultadoReciproco');
    resultado.textContent = '';
  
    if ([hiA, haB, ZABgraus, DAB, hiB, haA, ZBAgraus, DBA].some(v => isNaN(v))) {
      resultado.textContent = '⚠️ Preencha todos os campos corretamente';
      return;
    }
  
    const ZABrad = ZABgraus * Math.PI / 180;
    const ZBArad = ZBAgraus * Math.PI / 180;
  
    const deltaH_AB = DAB * Math.cos(ZABrad) + hiA - haB;
    const deltaH_BA = DBA * Math.cos(ZBArad) + hiB - haA;
  
    const deltaH_final = (deltaH_AB - deltaH_BA) / 2;
    resultado.textContent = `\u0394h final = (${deltaH_AB.toFixed(4)} - ${deltaH_BA.toFixed(4)}) / 2 = ${deltaH_final.toFixed(4)} m`;
  }
  