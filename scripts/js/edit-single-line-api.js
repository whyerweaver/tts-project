
require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { getProjectPath, ensureDirectoryExists } = require('../../initialize.js');

const voices = {
    'LAURA': 'FGY2WhTYpPnrIDTdsKH5',
    'AARON': 'TX3LPaxmHKxFdv7VOQHJ', 
    'CHRIS': 'iP95p4xoKVk53GoZ742B',
    'EFFECT': 'pFZP5JQG7iQjIQuC4Bku'
};

async function generateSingleLine(fileNumber, speaker, text) {
    try {
        const filename = `${fileNumber.toString().padStart(3, '0')}_${speaker.toLowerCase()}.mp3`;
        
        console.log(`Regenerating file ${filename}: ${speaker}`);
        
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voices[speaker]}`,
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
        
        ensureDirectoryExists(getProjectPath('output'));
        fs.writeFileSync(getProjectPath('output', filename), response.data);
        console.log(`✓ Updated: ${filename}`);
        
    } catch (error) {
        console.log(`✗ Error:`, error.message);
        throw error;
    }
}

generateSingleLine(1, 'LAURA', `Welcome to the show. Today we have a topic we're sure you'll enjoy and find informative.`);
