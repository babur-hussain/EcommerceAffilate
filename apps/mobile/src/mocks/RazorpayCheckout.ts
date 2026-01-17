const RazorpayCheckout = {
    open: (options: any) => {
        return new Promise((resolve, reject) => {
            console.log('Mock Razorpay Open:', options);
            // Simulate success
            setTimeout(() => {
                resolve({
                    razorpay_payment_id: 'pay_MOCK_' + Date.now(),
                    razorpay_order_id: options.order_id,
                    razorpay_signature: 'mock_signature',
                });
            }, 2000);
        });
    },
};

export default RazorpayCheckout;
