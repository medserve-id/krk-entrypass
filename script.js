function onScanSuccess(decodedText) {
  const [reg, nama, paroki, kota, wa] = decodedText.split("|");

  document.getElementById("reg").textContent = reg || "-";
  document.getElementById("name").textContent = nama || "-";
  document.getElementById("paroki").textContent = paroki || "-";
  document.getElementById("kota").textContent = kota || "-";
  document.getElementById("wa").textContent = wa || "-";

  document.getElementById("ticket").classList.remove("hidden");

  if (typeof AndroidBridge !== "undefined") {
    AndroidBridge.print(document.getElementById("ticket").innerHTML);
  }
}

const scanner = new Html5Qrcode("reader");

scanner.start(
  { facingMode: "environment" },
  { fps: 10, qrbox: 200 },
  onScanSuccess
).catch((err) => {
  document.getElementById("reader").innerText = "❌ Kamera gagal dibuka.";
});
