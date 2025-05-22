require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const voices = {
    'Laura': 'FGY2WhTYpPnrIDTdsKH5',
    'Liam': 'TX3LPaxmHKxFdv7VOQHJ', 
    'Chris': 'iP95p4xoKVk53GoZ742B'
};

async function testVoice(voiceName, text) {
    try {
        console.log(`Testing ${voiceName}...`);
        
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voices[voiceName]}`,
            {
                text: text,
                model_id: 'eleven_monolingual_v1'
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVENLABS_API_KEY
                },
                responseType: 'arraybuffer'
            }
        );
        
        fs.writeFileSync(`test_${voiceName.toLowerCase()}.mp3`, response.data);
        console.log(`✓ ${voiceName} test saved as test_${voiceName.toLowerCase()}.mp3`);
        
    } catch (error) {
        console.log(`✗ Error with ${voiceName}:`, error.message);
    }
}

async function testAllVoices() {
    await testVoice('Laura', 'Hello, this is Laura speaking. How does my voice sound?');
    await testVoice('Liam', 'Hi there, I am Liam. This is how I sound when I speak.');
    await testVoice('Chris', 'Good day, this is Chris. I hope my voice sounds clear and natural.');
}

testAllVoices();