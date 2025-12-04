let nomor = 0;
let skor = 0;
let dataSoal = [];

async function loadSoal() {
    const req = await fetch("soal.json");
    dataSoal = await req.json();
    tampilSoal();
}

function tampilSoal() {
    const q = dataSoal[nomor];
    document.getElementById("quiz").innerHTML = `
        <p>${nomor + 1}. ${q.pertanyaan}</p>
        ${q.pilihan.map(p => `
            <button class="pilihan" onclick="cekJawaban('${p}')">${p}</button>
        `).join("")}
    `;
}

function cekJawaban(pilihan) {
    const benar = dataSoal[nomor].jawaban;
    if (pilihan === benar) skor++;

    nomor++;

    if (nomor < dataSoal.length) {
        tampilSoal();
    } else {
        document.getElementById("hasil").innerHTML =
            `Selesai! Skor kamu: ${skor} dari ${dataSoal.length}`;
        document.getElementById("nextBtn").style.display = "none";
    }
}

document.getElementById("nextBtn").addEventListener("click", tampilSoal);

loadSoal();

