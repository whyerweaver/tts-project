require('dotenv').config({ path: './.env' });

console.log('API Key loaded:', process.env.ELEVENLABS_API_KEY ? 'Yes' : 'No');