function onScanSuccess(decodedText) {
  console.log("✅ QR Terdeteksi:", decodedText);

  if (decodedText.startsWith("REG|")) {
    handleTicket(decodedText);
  } else if (decodedText.startsWith("ABSEN|")) {
    handleAbsen(decodedText);
  } else if (decodedText.startsWith("CMD|")) {
    handleCommand(decodedText);
  } else {
    handleGeneric(decodedText);
  }

  // Hentikan scanner setelah berhasil
  scanner.stop().then(() => scanner.clear());
}

function handleTicket(qr) {
  const parts = qr.split("|");
  if (parts.length < 6) {
    alert("Format ENTRY PASS tidak valid.");
    return;
  }

  const [, reg, nama, paroki, kota, wa] = parts;

  const content = `*ENTRY PASS KRK*\nReg: ${reg}\nNama: ${nama}\nParoki: ${paroki}\nKota: ${kota}\nWA: ${wa}`;
  document.getElementById("result").textContent = content;

  if (typeof AndroidBridge !== "undefined") {
    AndroidBridge.print(content);
  }
}

function handleAbsen(qr) {
  const id = qr.replace("ABSEN|", "").trim();
  document.getElementById("result").textContent = `📋 Absen diterima untuk ID: ${id}`;
  if (typeof AndroidBridge !== "undefined") {
    AndroidBridge.sendAbsen(id);
  }
}

function handleCommand(qr) {
  const command = qr.replace("CMD|", "").trim();
  document.getElementById("result").textContent = `📡 Perintah sistem: ${command}`;
  // Tambahkan logika webhook atau konfigurasi di sini
}

function handleGeneric(qr) {
  document.getElementById("result").textContent = `📦 QR Detected:\n${qr}`;
  if (typeof AndroidBridge !== "undefined") {
    AndroidBridge.onQrScanned(qr);
  }
}

// Mulai scanner
const scanner = new Html5Qrcode("reader");
scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 250 },
  onScanSuccess
).catch(err => {
  document.getElementById("result").textContent = "❌ Gagal akses kamera.";
  console.error(err);
});
