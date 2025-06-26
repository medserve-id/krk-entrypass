let scanner = null;

function startScanner() {
  if (typeof Html5Qrcode === "undefined") {
    alert("Scanner belum siap. Coba refresh halaman atau tunggu sebentar.");
    return;
  }

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
  const data = decodedText.split("|");
  if (data.length < 5) {
    alert("QR tidak valid atau format tidak sesuai.");
    return;
  }

  const [reg, nama, paroki, kota, wa] = data;

  document.getElementById("reg").textContent = reg || "-";
  document.getElementById("name").textContent = nama || "-";
  document.getElementById("paroki").textContent = paroki || "-";
  document.getElementById("kota").textContent = kota || "-";
  document.getElementById("wa").textContent = wa || "-";

  document.getElementById("ticket").classList.remove("hidden");

  if (scanner) {
    scanner.stop().then(() => {
      scanner.clear();
    }).catch((e) => console.warn("❌ Gagal menghentikan scanner:", e));
  }

  if (typeof AndroidBridge !== "undefined" && AndroidBridge.print) {
    AndroidBridge.print(document.getElementById("ticket").innerHTML);
  } else {
    alert("AndroidBridge tidak tersedia. Cetak manual atau pastikan WebView Android aktif.");
  }
}

window.addEventListener("load", () => {
  const scanBtn = document.getElementById("scanBtn");
  if (scanBtn) scanBtn.disabled = false;
});
