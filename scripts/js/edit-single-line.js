require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { getProjectPath, ensureDirectoryExists } = require('../../initialize.js');

const voices = {
    'LAURA': 'FGY2WhTYpPnrIDTdsKH5',
    'AARON': 'TX3LPaxmHKxFdv7VOQHJ', 
    'CHRIS': 'iP95p4xoKVk53GoZ742B'
};

function findDialogueByFileNumber(fileNumber, speaker) {
    try {
        const script = fs.readFileSync(getProjectPath('script.txt'), 'utf8');
        const lines = script.split('\n').filter(line => line.trim());
        
        let audioCounter = 1;
        
        for (const line of lines) {
            if (line.startsWith('[SFX_')) {
                // Sound effect marker - logged but doesn't increment counter
                // (matches generate-audio.js logic exactly)
                continue;
            } else if (line.includes(':')) {
                // Voice line
                const [lineSpeaker, ...textParts] = line.split(':');
                const text = textParts.join(':').trim();
                const cleanSpeaker = lineSpeaker.trim();
                
                if (text && voices[cleanSpeaker]) {
                    // This would be audio file number audioCounter
                    if (audioCounter === fileNumber) {
                        if (cleanSpeaker !== speaker) {
                            console.log(`✗ Error: File ${fileNumber.toString().padStart(3, '0')} is spoken by ${cleanSpeaker}, not ${speaker}`);
                            console.log(`   Line content: "${text}"`);
                            return null;
                        }
                        
                        return {
                            speaker: cleanSpeaker,
                            text: text,
                            fileNumber: audioCounter
                        };
                    }
                    audioCounter++; // Only increment for actual audio files
                }
            }
        }
        
        console.log(`✗ Error: File number ${fileNumber} not found. Script generates ${audioCounter - 1} audio files.`);
        return null;
        
    } catch (error) {
        console.log(`✗ Error reading script.txt: ${error.message}`);
        return null;
    }
}

async function generateSingleLine(fileNumber, speaker) {
    try {
        // Find the line using the same numbering as generate-audio.js
        const scriptLine = findDialogueByFileNumber(fileNumber, speaker);
        if (!scriptLine) {
            return;
        }
        
        const filename = `${fileNumber.toString().padStart(3, '0')}_${speaker.toLowerCase()}.mp3`;
        
        console.log(`Regenerating file ${filename}: ${speaker}`);
        console.log(`Text from script: "${scriptLine.text}"`);
        
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voices[speaker]}`,
            {
                text: scriptLine.text,
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
        console.log(`✓ Updated: ${filename}`);
        
    } catch (error) {
        console.log(`✗ Error:`, error.message);
    }
}

// EDIT THESE VALUES:
const fileNumber = 1;  // Which audio file number to replace (matches 001_, 002_, etc.)
const speaker = 'LAURA';  // LAURA, AARON, or CHRIS - must match the speaker for that file

generateSingleLine(fileNumber, speaker);