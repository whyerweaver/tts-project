require('dotenv').config();
const axios = require('axios');

async function testConnection() {
    try {
        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
        });
        
        console.log('Connection successful!');
        console.log('Available voices:', response.data.voices.length);
        console.log('First voice name:', response.data.voices[0].name);
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

testConnection();