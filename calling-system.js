const twilio = require('twilio');
const accountSid = process.env.accountSid
const authToken = process.env.authToken
const client = new twilio(accountSid, authToken);

const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.post('/voice', (req, res) => {
    const voiceResponse = client.twiml.VoiceResponse();

    const gather = voiceResponse.gather({
        numDigits: 1,
        action: '/handle-key', // Define another route to handle the key press
    });

    gather.say('For CDL School, press 1. For CDL test with translation, press 2.');

    // If the user doesn't input anything, loop back
    voiceResponse.redirect('/voice');

    res.type('text/xml');
    res.send(voiceResponse.toString());
});

app.post('/handle-key', (req, res) => {
    const digit = req.body.Digits;
    const voiceResponse = client.twiml.VoiceResponse();

    if (digit == '1') {
        // Implement logic for CDL School
        voiceResponse.play('/contact.mp3');
    } else if (digit == '2') {
        // Implement logic for CDL test with translation
        voiceResponse.play('/contact-hold.mp3');
    } else {
        voiceResponse.say('Invalid option');
        voiceResponse.redirect('/voice');
    }

    res.type('text/xml');
    res.send(voiceResponse.toString());
});
