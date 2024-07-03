const axios = require('axios');

const sendSMS = async (phoneNumber, message) => {
    try {
        const apiKey = process.env.FAST_TWO_SMS_API_KEY; // Replace with your Fast2SMS API key
        const url = 'https://www.fast2sms.com/dev/bulk';

        const response = await axios.post(url, {
            sender_id: 'FSTSMS',
            message: message,
            language: 'english',
            route: 'p',
            numbers: phoneNumber  // Assuming phoneNumber is in format '+919876543210'
        }, {
            headers: {
                'authorization': apiKey,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        console.log('SMS sent successfully:', response.data);
        return response.data; // Return the response data if needed
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
        throw error; // Optionally re-throw the error to handle it further up the call stack
    }
};

module.exports = sendSMS;
