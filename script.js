
let isPaused = false, isStopped = false;
const vivas = [], die = [], unknown = [];
const procesadas = new Set();

document.getElementById('validateBtn').onclick = async () => {
    const inputBox = document.getElementById('input');
    let lines = inputBox.value.split('\n').map(l => l.trim()).filter(l => l);

    for (let i = 0; i < lines.length; i++) {
        if (isStopped) break;
        while (isPaused) await new Promise(r => setTimeout(r, 300));

        const line = lines[i];
        if (procesadas.has(line)) {
            lines.splice(i, 1);
            inputBox.value = lines.slice(i).join('\n');
            i--;
            continue;
        }
        procesadas.add(line);

        const [cc, mm, yy, cvv] = line.split('|');
        const idx = `[${i}] ${line}`;

        const result = Math.random() > 0.5
            ? { status: "LIVE", message: "Aprobada" }
            : { status: "DIE", message: "Rechazada" };

        if (result.status === "LIVE") vivas.push(`${idx} => ${result.message}`);
        else if (result.status === "DIE") die.push(`${idx} => ${result.message}`);
        else unknown.push(`${idx} => ${result.message}`);

        lines.splice(i, 1);
        inputBox.value = lines.slice(i).join('\n');
        i--;
    }
};

// Descargar tarjetas vivas
document.getElementById("downloadBtn").onclick = () => {
    const blob = new Blob([vivas.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vivas.txt";
    a.click();
};
