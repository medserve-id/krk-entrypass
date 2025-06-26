let scanner = null;

function startScanner() {
  scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 200 },
    onScanSuccess
  ).catch((err) => {
    document.getElementById("reader").innerText = "❌ Kamera tidak bisa dibuka.";
    console.error(err);
  });
}

function onScanSuccess(decodedText) {
  // Format QR yang di-scan: REG123|Nama Peserta|Paroki|Kota|WA
  const [reg, nama, paroki, kota, wa] = decodedText.split("|");

  document.getElementById("reg").textContent = reg || "-";
  document.getElementById("name").textContent = nama || "-";
  document.getElementById("paroki").textContent = paroki || "-";
  document.getElementById("kota").textContent = kota || "-";
  document.getElementById("wa").textContent = wa || "-";

  document.getElementById("ticket").classList.remove("hidden");

  // Stop kamera agar tidak scan terus-menerus
  if (scanner) {
    scanner.stop().then(() => {
      scanner.clear();
    }).catch((e) => console.warn("❌ Gagal menghentikan scanner:", e));
  }

  // Kirim ke Android untuk cetak
  if (typeof AndroidBridge !== "undefined") {
    AndroidBridge.print(document.getElementById("ticket").innerHTML);
  }
}
