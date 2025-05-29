// initialize.js - Centralized Path Management for TTS Project
// Similar to initialize.php pattern - sets up all project paths

const path = require('path');

// Find the project root (where package.json lives)
function findProjectRoot() {
    let currentDir = __dirname;
    
    // Keep going up directories until we find package.json
    while (currentDir !== path.dirname(currentDir)) {
        const packagePath = path.join(currentDir, 'package.json');
        const fs = require('fs');
        
        if (fs.existsSync(packagePath)) {
            return currentDir;
        }
        
        currentDir = path.dirname(currentDir);
    }
    
    throw new Error('Could not find project root (package.json not found)');
}

// Set up all project paths
const PROJECT_ROOT = findProjectRoot();

const PATHS = {
    // Core project directories
    PROJECT_ROOT: PROJECT_ROOT,
    SCRIPTS_DIR: path.join(PROJECT_ROOT, 'scripts'),
    JS_SCRIPTS_DIR: path.join(PROJECT_ROOT, 'scripts', 'js'),
    PYTHON_SCRIPTS_DIR: path.join(PROJECT_ROOT, 'scripts', 'python'),
    
    // Input/Output directories
    OUTPUT_DIR: path.join(PROJECT_ROOT, 'output'),
    SOUND_EFFECTS_DIR: path.join(PROJECT_ROOT, 'sound-effects'),
    FINAL_DIR: path.join(PROJECT_ROOT, 'final'),
    
    // Key files
    SCRIPT_FILE: path.join(PROJECT_ROOT, 'script.txt'),
    TIMING_LOG_FILE: path.join(PROJECT_ROOT, 'timing-log.txt'),
    ENV_FILE: path.join(PROJECT_ROOT, '.env'),
    PACKAGE_JSON: path.join(PROJECT_ROOT, 'package.json')
};

// Helper function to ensure directories exist
function ensureDirectoryExists(dirPath) {
    const fs = require('fs');
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
    }
}

// Initialize required directories
function initializeDirectories() {
    ensureDirectoryExists(PATHS.OUTPUT_DIR);
    ensureDirectoryExists(PATHS.SOUND_EFFECTS_DIR);
    ensureDirectoryExists(PATHS.FINAL_DIR);
}

// Debug function to show all paths
function showPaths() {
    console.log('\n🗂️  TTS Project Paths:');
    console.log('========================');
    for (const [key, value] of Object.entries(PATHS)) {
        console.log(`${key}: ${value}`);
    }
    console.log('========================\n');
}

module.exports = {
    PATHS,
    initializeDirectories,
    showPaths,
    PROJECT_ROOT
};