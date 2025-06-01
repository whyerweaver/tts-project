const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { spawn } = require('child_process');
const { getProjectPath } = require('./initialize.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to save script and regenerate audio
app.post('/api/save-and-regenerate', async (req, res) => {
    try {
        const { lineNumber, speaker, newText } = req.body;
        
        console.log(`📝 Edit request: Line ${lineNumber}, Speaker: ${speaker}`);
        console.log(`📝 New text: "${newText}"`);
        
        // Update script.txt file
        await updateScriptFile(lineNumber, newText);
        
        // Generate new audio
        await generateAudio(lineNumber, speaker, newText);
        
        res.json({ 
            success: true, 
            message: 'Script updated and audio regenerated successfully',
            filename: `${lineNumber.toString().padStart(3, '0')}_${speaker.toLowerCase()}.mp3`
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

async function updateScriptFile(lineNumber, newText) {
    // Read current script
    const scriptPath = getProjectPath('script.txt');
    const script = fs.readFileSync(scriptPath, 'utf8');
    const lines = script.split('\n');
    
    // Find and update the correct line
    let audioCounter = 1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('[SFX_') || line.startsWith('EFFECT:')) {
            // Sound effect - increment counter but don't modify
            audioCounter++;
        } else if (line.includes(':')) {
            // Voice line
            const [speaker, ...textParts] = line.split(':');
            const text = textParts.join(':').trim();
            
            if (text && speaker.trim()) {
                if (audioCounter === lineNumber) {
                    // This is the line to update
                    lines[i] = `${speaker.trim()}: ${newText}`;
                    console.log(`✓ Updated line ${i + 1} in script.txt`);
                    break;
                }
                audioCounter++;
            }
        }
    }
    
    // Write updated script
    fs.writeFileSync(scriptPath, lines.join('\n'));
}

async function generateAudio(lineNumber, speaker, text) {
    return new Promise((resolve, reject) => {
        // Use existing edit-single-line.js logic
        const editScript = getProjectPath('scripts', 'js', 'edit-single-line-api.js');
        
        // Create temporary API version of edit-single-line.js
        createEditApiScript(lineNumber, speaker, text);
        
        // Run the audio generation
        const process = spawn('node', [editScript], {
            cwd: getProjectPath()
        });
        
        process.on('close', (code) => {
            if (code === 0) {
                console.log(`✓ Audio generated successfully`);
                resolve();
            } else {
                reject(new Error(`Audio generation failed with code ${code}`));
            }
        });
        
        process.on('error', (error) => {
            reject(error);
        });
    });
}

function createEditApiScript(lineNumber, speaker, text) {
    // Create a temporary version of edit-single-line.js for API use
    const apiScript = `
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
        const filename = \`\${fileNumber.toString().padStart(3, '0')}_\${speaker.toLowerCase()}.mp3\`;
        
        console.log(\`Regenerating file \${filename}: \${speaker}\`);
        
        const response = await axios.post(
            \`https://api.elevenlabs.io/v1/text-to-speech/\${voices[speaker]}\`,
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
        console.log(\`✓ Updated: \${filename}\`);
        
    } catch (error) {
        console.log(\`✗ Error:\`, error.message);
        throw error;
    }
}

generateSingleLine(${lineNumber}, '${speaker}', \`${text}\`);
`;
    
    const apiScriptPath = getProjectPath('scripts', 'js', 'edit-single-line-api.js');
    fs.writeFileSync(apiScriptPath, apiScript);
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TTS Edit Server running on http://localhost:${PORT}`);
    console.log(`📝 Ready to handle save & regenerate requests`);
});