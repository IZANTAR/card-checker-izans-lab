// Luhn valida
function validLuhn(cc) {
  let sum = 0, alt = false;
  for (let i = cc.length - 1; i >= 0; i--) {
    let d = parseInt(cc[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    sum += d; alt = !alt;
  }
  return sum % 10 === 0;
}

let isPaused = false, isStopped = false;
const vivas = [], die = [], unknown = [];

document.getElementById('validateBtn').onclick = async () => {
  const lines = document.getElementById('input').value.split('\n')
    .map(l => l.trim()).filter(l => l);
  clearResults();  // Limpiar resultados antes de comenzar

  for (let i = 0; i < lines.length; i++) {
    if (isStopped) break;
    while (isPaused) await new Promise(r => setTimeout(r, 300));

    const [cc, mm, yy, cvv] = lines[i].split('|');
    const idx = `[${i}] ${lines[i]}`;

    if (!validLuhn(cc)) {
      unknown.push(`${idx} => DESCONOCIDA - Luhn incorrecto`);
      updateDisplay(); continue;
    }

    const bin = cc.slice(0, 6);
    const binData = await getBinData(bin);
    const gate = document.getElementById('gateway').value;
    let check = { status: 'UNKNOWN', message: 'Sin ejecutar' };

    if (gate === 'braintree') check = await verifyCard(cc, mm, yy, cvv);
    else if (gate === 'binlookup') check = { status: 'UNKNOWN', message: binData };
    else if (gate === 'random') check = Math.random() < 0.5
      ? { status: 'LIVE', message: 'Demo zuf' } : { status: 'DIE', message: 'Demo zuf' };
    else check = { status: 'UNKNOWN', message: `Pasarela ${gate} no implementada` };

    const lineOut = `${idx} => ${check.status} - ${check.message}\n${binData}`;
    if (check.status === 'LIVE') vivas.push(lineOut);
    else if (check.status === 'DIE') die.push(lineOut);
    else unknown.push(lineOut);

    updateDisplay();
    await new Promise(r => setTimeout(r, 300));
  }
};

document.getElementById('pauseBtn').onclick = () => {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Reanudar' : 'Pausa';
};

document.getElementById('stopBtn').onclick = () => isStopped = true;

async function getBinData(bin) {
  try {
    let res = await fetch(`/bininfo?bin=${bin}`);
    if (!res.ok) throw '';
    let d = await res.json();
    return formatBinData(d);
  } catch {
    try {
      const alt = await fetch(`https://bincheck.io/api/${bin}`);
      if (!alt.ok) throw '';
      let d = await alt.json();
      return formatBinData(d);
    } catch {
      return '🌍 BIN Info no disponible';
    }
  }
}

function formatBinData(d) {
  const ct = d.country?.emoji ? `${d.country.emoji} ${d.country.name}` : d.country?.name || '';
  return `🌍 ${ct} • ${d.bank?.name || ''} • ${d.type || ''} • ${(d.scheme || d.brand || '').toUpperCase()}`;
}

async function verifyCard(cc, mm, yy, cvv) {
  try {
    const res = await fetch('/check', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ number: cc, month: mm, year: yy, cvv: cvv })
    });
    return res.ok ? await res.json() : { status: 'UNKNOWN', message: 'Error HTTP' };
  } catch {
    return { status: 'UNKNOWN', message: 'Fallo fetch' };
  }
}

function updateDisplay() {
  document.getElementById('vivasToggle').textContent = `Vivas: ${vivas.length}`;
  document.getElementById('dieToggle').textContent = `Muertas: ${die.length}`;
  document.getElementById('unknownToggle').textContent = `Desconocidas: ${unknown.length}`;
  document.getElementById('vivasResults').innerText = vivas.join('\n\n');
  document.getElementById('dieResults').innerText = die.join('\n\n');
  document.getElementById('unknownResults').innerText = unknown.join('\n\n');
}

function toggleBox(id) {
  const el = document.getElementById(id);
  el.style.display = (el.style.display === 'block') ? 'none' : 'block';
}

function descargarVivas() {
  const txt = document.getElementById('vivasResults').innerText.trim();
  if (!txt) return alert('No hay vivas que descargar.');
  const blob = new Blob([txt], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'vivas_resultados.txt';
  a.click();
}

// Función para limpiar los resultados antes de empezar
function clearResults() {
  vivas.length = 0;
  die.length = 0;
  unknown.length = 0;

  document.getElementById('vivasResults').innerText = '';
  document.getElementById('dieResults').innerText = '';
  document.getElementById('unknownResults').innerText = '';
}
