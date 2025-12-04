let dataSoal = [];
let current = 0;
let jawabanUser = {};
let waktu = 20 * 60; // 20 menit
let timerInterval;

document.getElementById("mulaiBtn").onclick = async function() {
  const mapel = document.getElementById("pilihMapel").value;

  if (!mapel) return alert("Pilih mapel dulu!");

  await loadSoal(mapel);
  tampilNomor();
  tampilSoal();
  mulaiTimer();

  document.getElementById("selesaiBtn").style.display = "block";
};

async function loadSoal(mapel) {
  const req = await fetch(`bank/${mapel}.json`);
  dataSoal = await req.json();
}

function tampilNomor() {
  const box = document.getElementById("nomorSoal");
  box.innerHTML = "";

  dataSoal.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;

    btn.onclick = () => {
      current = i;
      tampilSoal();
    };

    box.appendChild(btn);
  });
}

function tampilSoal() {
  const q = dataSoal[current];
  const box = document.getElementById("soalBox");

  box.innerHTML = `
    <h3>Soal ${current + 1}</h3>
    <p>${q.pertanyaan}</p>
    ${q.pilihan.map(p => `
      <button onclick="pilihJawaban('${p}')"
      class="${jawabanUser[current] === p ? 'dipilih' : ''}">
        ${p}
      </button>
    `).join("")}
  `;

  updateNomor();
}

function pilihJawaban(p) {
  jawabanUser[current] = p;
  updateNomor();
  tampilSoal();
}

function updateNomor() {
  const btns = document.querySelectorAll("#nomorSoal button");

  btns.forEach((b, i) => {
    if (jawabanUser[i]) b.classList.add("answered");
    else b.classList.remove("answered");
  });
}

document.getElementById("selesaiBtn").onclick = function() {
  selesaiUjian();
};

function selesaiUjian() {
  clearInterval(timerInterval);
  let benar = 0;

  dataSoal.forEach((s, i) => {
    if (jawabanUser[i] === s.jawaban) benar++;
  });

  document.getElementById("soalBox").innerHTML = `
    <h2>Ujian Selesai</h2>
    <p>Benar: ${benar}</p>
    <p>Total Soal: ${dataSoal.length}</p>
    <h3>Nilai: ${(benar / dataSoal.length * 100).toFixed(0)}</h3>
  `;
}

function mulaiTimer() {
  timerInterval = setInterval(() => {
    waktu--;

    const menit = String(Math.floor(waktu / 60)).padStart(2, "0");
    const detik = String(waktu % 60).padStart(2, "0");

    document.getElementById("timer").textContent = `${menit}:${detik}`;

    if (waktu <= 0) selesaiUjian();
  }, 1000);
}
