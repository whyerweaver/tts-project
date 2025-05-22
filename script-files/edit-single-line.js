require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

const voices = {
    'LAURA': 'FGY2WhTYpPnrIDTdsKH5',
    'AARON': 'TX3LPaxmHKxFdv7VOQHJ', 
    'CHRIS': 'iP95p4xoKVk53GoZ742B'
};

async function generateSingleLine(speaker, text, lineNumber) {
    try {
        const filename = `${lineNumber.toString().padStart(3, '0')}_${speaker.toLowerCase()}.mp3`;
        
        console.log(`Regenerating line ${lineNumber}: ${speaker}`);
        console.log(`New text: "${text}"`);
        
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
        
        fs.writeFileSync(`output/${filename}`, response.data);
        console.log(`✓ Updated: ${filename}`);
        
    } catch (error) {
        console.log(`✗ Error:`, error.message);
    }
}

// EDIT THESE VALUES:
const lineNumber = 1;  // Which line number to replace (check timing-log.txt)
const speaker = 'LAURA';  // LAURA, AARON, or CHRIS
const newText = 'Welcome to the show, everyone! We have an interesting and timely topic for you today.';  // Your new text

generateSingleLine(speaker, newText, lineNumber);