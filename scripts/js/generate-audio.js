require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { getProjectPath, ensureDirectoryExists } = require('../../initialize.js');

const voices = {
    'LAURA': 'FGY2WhTYpPnrIDTdsKH5',
    'AARON': 'TX3LPaxmHKxFdv7VOQHJ', 
    'CHRIS': 'iP95p4xoKVk53GoZ742B'
};

async function generateSpeech(voiceName, text, filename) {
    try {
        console.log(`Generating: ${filename}...`);
        
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
        
        // Use dynamic path builder - works from anywhere!
        ensureDirectoryExists(getProjectPath('output'));
        fs.writeFileSync(getProjectPath('output', filename), response.data);
        console.log(`✓ Created: ${filename}`);
        
    } catch (error) {
        console.log(`✗ Error creating ${filename}:`, error.message);
    }
}

async function processScript() {
    // Ensure output directory exists
    ensureDirectoryExists(getProjectPath('output'));
    
    const script = fs.readFileSync(getProjectPath('script.txt'), 'utf8');
    const lines = script.split('\n').filter(line => line.trim());
    
    let audioCounter = 1;
    let timingLog = [];
    
    for (const line of lines) {
        if (line.startsWith('[SFX_')) {
            // Sound effect marker - log it but DON'T increment counter
            timingLog.push(`${audioCounter.toString().padStart(3, '0')}: ${line}`);
            console.log(`⚡ Sound effect noted: ${line}`);
        } else if (line.includes(':')) {
            // Voice line
            const [speaker, ...textParts] = line.split(':');
            const text = textParts.join(':').trim();
            
            if (text && voices[speaker.trim()]) {
                const filename = `${audioCounter.toString().padStart(3, '0')}_${speaker.trim().toLowerCase()}.mp3`;
                await generateSpeech(speaker.trim(), text, filename);
                timingLog.push(`${audioCounter.toString().padStart(3, '0')}: ${speaker.trim()} - "${text.substring(0, 50)}..."`);
                audioCounter++; // Only increment for actual audio files
            }
        }
    }
    
    // Save timing log
    fs.writeFileSync(getProjectPath('timing-log.txt'), timingLog.join('\n'));
    console.log('\n✓ All audio generated!');
    console.log('✓ Check the "output" folder for your MP3 files');
    console.log('✓ Check "timing-log.txt" for the sequence and sound effect locations');
}

processScript();