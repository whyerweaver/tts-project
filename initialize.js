// initialize.js - Dynamic Path Builder for TTS Project
// JavaScript equivalent to PHP initialize.php pattern
// Finds project root and builds any path dynamically

const path = require('path');
const fs = require('fs');

// Find project root by looking for package.json (like finding web root in PHP)
function findProjectRoot(startDir = __dirname) {
    let currentDir = startDir;
    
    while (currentDir !== path.dirname(currentDir)) {
        const packagePath = path.join(currentDir, 'package.json');
        
        if (fs.existsSync(packagePath)) {
            return currentDir;
        }
        
        currentDir = path.dirname(currentDir);
    }
    
    throw new Error('Could not find project root (package.json not found)');
}

// Main function: build any path relative to project root
function getProjectPath(...pathParts) {
    const projectRoot = findProjectRoot();
    return path.join(projectRoot, ...pathParts);
}

// Helper function to ensure any directory exists
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dirPath}`);
    }
}

// Debug function - show project root and test some paths
function showProjectInfo() {
    const projectRoot = findProjectRoot();
    console.log('\n🗂️  TTS Project Dynamic Paths:');
    console.log('=====================================');
    console.log(`Project Root: ${projectRoot}`);
    console.log(`Script File:  ${getProjectPath('script.txt')}`);
    console.log(`Output Dir:   ${getProjectPath('output')}`);
    console.log(`Any Path:     ${getProjectPath('new-folder', 'subfolder', 'file.ext')}`);
    console.log('=====================================\n');
}

// If run directly, show demo
if (require.main === module) {
    showProjectInfo();
    
    // Ensure common directories exist
    ensureDirectoryExists(getProjectPath('output'));
    ensureDirectoryExists(getProjectPath('sound-effects'));
    ensureDirectoryExists(getProjectPath('final'));
}

module.exports = {
    getProjectPath,
    ensureDirectoryExists
};