require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

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
        
        fs.writeFileSync(`output/${filename}`, response.data);
        console.log(`✓ Created: ${filename}`);
        
    } catch (error) {
        console.log(`✗ Error creating ${filename}:`, error.message);
    }
}

async function processScript() {
    // Create output folder
    if (!fs.existsSync('output')) {
        fs.mkdirSync('output');
    }
    
    const script = fs.readFileSync('script.txt', 'utf8');
    const lines = script.split('\n').filter(line => line.trim());
    
    let audioCounter = 1;
    let timingLog = [];
    
    for (const line of lines) {
        if (line.startsWith('[SFX_')) {
            // Sound effect marker
            timingLog.push(`${audioCounter.toString().padStart(3, '0')}: ${line}`);
            console.log(`⚡ Sound effect noted: ${line}`);
        } else if (line.includes(':')) {
            // Voice line
            const [speaker, ...textParts] = line.split(':');
            const text = textParts.join(':').trim();
            
            if (text && voices[speaker]) {
                const filename = `${audioCounter.toString().padStart(3, '0')}_${speaker.toLowerCase()}.mp3`;
                await generateSpeech(speaker, text, filename);
                timingLog.push(`${audioCounter.toString().padStart(3, '0')}: ${speaker} - "${text.substring(0, 50)}..."`);
                audioCounter++;
            }
        }
    }
    
    // Save timing log
    fs.writeFileSync('timing-log.txt', timingLog.join('\n'));
    console.log('\n✓ All audio generated!');
    console.log('✓ Check the "output" folder for your MP3 files');
    console.log('✓ Check "timing-log.txt" for the sequence and sound effect locations');
}

processScript();