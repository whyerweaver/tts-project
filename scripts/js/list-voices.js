require('dotenv').config();
const axios = require('axios');

async function listVoices() {
    try {
        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
        });
        
        console.log('Your available voices:\n');
        response.data.voices.forEach((voice, index) => {
            console.log(`${index + 1}. ${voice.name} (${voice.voice_id})`);
            console.log(`   Gender: ${voice.labels?.gender || 'Unknown'}`);
            console.log(`   Age: ${voice.labels?.age || 'Unknown'}`);
            console.log('');
        });
        
    } catch (error) {
        console.log('Error:', error.message);
    }
}

listVoices();