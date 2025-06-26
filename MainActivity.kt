package com.example.qrcetak

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import androidx.appcompat.app.AppCompatActivity
import android.widget.Toast

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var btService: BluetoothService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        btService = BluetoothService(this) // Asumsikan sudah siap koneksi

        webView.settings.javaScriptEnabled = true
        webView.settings.allowFileAccess = true
        webView.webViewClient = WebViewClient()

        webView.addJavascriptInterface(JSBridge(), "AndroidBridge")

        webView.loadUrl("file:///android_asset/index.html")
    }

    inner class JSBridge {
        @JavascriptInterface
        fun onQrScanned(data: String) {
            runOnUiThread {
                if (btService.isConnected()) {
                    btService.print(data)
                    Toast.makeText(applicationContext, "✅ Mencetak...", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(applicationContext, "⚠️ Printer belum terhubung", Toast.LENGTH_LONG).show()
                    btService.selectPrinter() // Menampilkan dialog pilih printer jika belum terhubung
                }
            }
        }
    }
}
