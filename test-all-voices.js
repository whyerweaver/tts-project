require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const { getProjectPath, ensureDirectoryExists } = require('./initialize.js');

// All 21 available voices from your account
const allVoices = {
    'Aria': '9BWtsMINqrJLrRacOk9x',
    'Sarah': 'EXAVITQu4vr4xnSDxMaL',
    'Laura': 'FGY2WhTYpPnrIDTdsKH5',
    'Charlie': 'IKne3meq5aSn9XLyUdCD',
    'George': 'JBFqnCBsd6RMkjVDRZzb',
    'Callum': 'N2lVS1w4EtoT3dr4eOWO',
    'River': 'SAz9YHcvj6GT2YYXdXww',
    'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
    'Charlotte': 'XB0fDUnXU5powFXDhCwa',
    'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
    'Matilda': 'XrExE9yKIg1WjnnlVkGX',
    'Will': 'bIHbv24MWmeRgasZH58o',
    'Jessica': 'cgSgspJ2msm6clMCkdW9',
    'Eric': 'cjVigY5qzO86Huf0OWal',
    'Chris': 'iP95p4xoKVk53GoZ742B',
    'Brian': 'nPczCjzI2devNBz1zQrb',
    'Daniel': 'onwK4e9ZLuTAKqWW03F9',
    'Lily': 'pFZP5JQG7iQjIQuC4Bku',
    'Bill': 'pqHfZKP75CvOlQylNhV4',
    'Emma': 'S9EGwlCtMF7VXtENq79v',
    'Belinda': 'wXAal9RMj0C7eM8ZnLo9'
};

const soundEffectText = "A phone is ringing. This is a gentle sound effect placeholder.";

async function testVoice(voiceName, voiceId) {
    try {
        console.log(`Testing ${voiceName}...`);
        
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            {
                text: soundEffectText,
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
        
        const filename = `voice_test_${voiceName.toLowerCase().replace(' ', '_')}.mp3`;
        ensureDirectoryExists(getProjectPath('voice-tests'));
        fs.writeFileSync(getProjectPath('voice-tests', filename), response.data);
        console.log(`✓ ${voiceName} saved as ${filename}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
    } catch (error) {
        console.log(`✗ Error with ${voiceName}:`, error.message);
    }
}

async function testAllVoices() {
    console.log('Testing all 21 voices with sound effect text...\n');
    console.log(`Text: "${soundEffectText}"\n`);
    
    for (const [name, id] of Object.entries(allVoices)) {
        await testVoice(name, id);
    }
    
    console.log('\n✓ All voice tests complete!');
    console.log('✓ Check the "voice-tests" folder to hear all samples');
    console.log('✓ Pick the best voice for sound effects and let me know!');
}

testAllVoices();