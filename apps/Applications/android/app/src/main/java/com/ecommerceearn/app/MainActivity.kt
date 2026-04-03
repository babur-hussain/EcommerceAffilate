package com.ecommerceearn.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.ecommerceearn.app.ui.pages.ContentView
import com.ecommerceearn.app.ui.pages.SplashScreenView
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.razorpay.PaymentData
import com.razorpay.PaymentResultWithDataListener
import com.ecommerceearn.app.data.services.RazorpayService
import com.ecommerceearn.app.utils.AppLogger

class MainActivity : ComponentActivity(), PaymentResultWithDataListener {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // Very simple root mounting mimicking ContentView/Splash lifecycle
            var showSplash by remember { mutableStateOf(true) }
            
            if (showSplash) {
                SplashScreenView(onSplashComplete = { showSplash = false })
            } else {
                ContentView()
            }
        }
        
        RazorpayService.init(this)
    }

    override fun onPaymentSuccess(s: String?, paymentData: PaymentData?) {
        AppLogger.info("Razorpay Payment Success: $s")
        RazorpayService.activeListener?.onPaymentSuccess(s, paymentData)
    }

    override fun onPaymentError(code: Int, response: String?, paymentData: PaymentData?) {
        AppLogger.error("Razorpay Payment Error: $code | $response")
        RazorpayService.activeListener?.onPaymentError(code, response, paymentData)
    }
}
