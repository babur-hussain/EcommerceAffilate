const AllInOneSDKManager = {
    startTransaction: (
        orderId: string,
        mid: string,
        txnToken: string,
        amount: string,
        callbackUrl: string,
        isStaging: boolean,
        restrictAppInvoke: boolean,
        urlScheme: string
    ) => {
        return new Promise((resolve, reject) => {
            console.log('Use of Mock Paytm SDK');
            console.log('Transaction Details:', { orderId, mid, amount, isStaging });

            // Simulate success after delay
            setTimeout(() => {
                resolve({
                    STATUS: 'TXN_SUCCESS',
                    RESPMSG: 'Txn Success',
                    ORDERID: orderId,
                    TXNAMOUNT: amount,
                    TXNID: 'MOCK_TXN_' + Date.now(),
                    CHECKSUMHASH: 'MOCK_CHECKSUM',
                    BANKTXNID: 'MOCK_BANK_TXN_ID',
                });
            }, 2000);
        });
    },
};

export default AllInOneSDKManager;
