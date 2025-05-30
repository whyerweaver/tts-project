const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');
const { getProjectPath } = require('../../initialize.js');

class AudioPreview {
    constructor() {
        this.audioFiles = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.shouldStop = false;
        this.currentProcess = null;
        this.gapDuration = 200; // 1 second in milliseconds
        
        // Setup readline for keyboard input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        // Setup keyboard listener
        this.setupKeyboardListener();
    }
    
    getAudioFiles() {
        try {
            const outputDir = getProjectPath('output');
            const files = fs.readdirSync(outputDir)
                .filter(file => file.endsWith('.mp3'))
                .map(file => path.join(outputDir, file))
                .sort((a, b) => {
                    const numA = parseInt(path.basename(a).split('_')[0]);
                    const numB = parseInt(path.basename(b).split('_')[0]);
                    return numA - numB;
                });
            
            return files;
        } catch (error) {
            console.log(`Error reading audio files: ${error.message}`);
            return [];
        }
    }
    
    extractInfoFromFilename(filepath) {
        const filename = path.basename(filepath);
        if (filename.includes('_')) {
            const parts = filename.split('_');
            const number = parts[0];
            const speaker = parts[1].replace('.mp3', '').toUpperCase();
            return { number, speaker };
        }
        return { number: '000', speaker: 'UNKNOWN' };
    }
    
    showControls() {
        console.clear();
        console.log('═'.repeat(60));
        console.log('🎵 AUDIO PREVIEW - JavaScript Edition');
        console.log('═'.repeat(60));
        console.log('Controls:');
        console.log('  SPACE = Pause/Resume  |  S = Stop  |  R = Repeat');
        console.log('  N = Next  |  P = Previous  |  ? = Help');
        console.log('═'.repeat(60));
    }
    
    showCurrentFile() {
        if (this.currentIndex < this.audioFiles.length) {
            const currentFile = this.audioFiles[this.currentIndex];
            const { number, speaker } = this.extractInfoFromFilename(currentFile);
            const status = this.isPaused ? '⏸ PAUSED' : this.isPlaying ? '▶ PLAYING' : '⏹ STOPPED';
            
            console.log(`\n[${this.currentIndex + 1}/${this.audioFiles.length}] ${status}`);
            console.log(`File: ${number}_${speaker.toLowerCase()}.mp3`);
            console.log(`Speaker: ${speaker}`);
        }
    }
    
    async playCurrentFile() {
        if (this.currentIndex >= this.audioFiles.length || this.shouldStop) {
            return false;
        }
        
        const currentFile = this.audioFiles[this.currentIndex];
        this.showControls();
        this.showCurrentFile();
        
        return new Promise((resolve) => {
            // Cross-platform audio player detection
            const isWindows = process.platform === 'win32';
            const isMac = process.platform === 'darwin';
            const isLinux = process.platform === 'linux';
            
            let command, args;
            
            if (isWindows) {
                // Windows: Try multiple options in order of reliability
                // Option 1: Use PowerShell with Windows Media Player
                command = 'powershell';
                args = ['-c', `
                    Add-Type -AssemblyName presentationCore;
                    $mediaPlayer = New-Object System.Windows.Media.MediaPlayer;
                    $mediaPlayer.open([System.Uri]'${currentFile.replace(/\\/g, '/')}');
                    $mediaPlayer.Play();
                    Start-Sleep -Seconds 1;
                    while($mediaPlayer.NaturalDuration.HasTimeSpan -eq $false) { Start-Sleep -Milliseconds 50 };
                    $duration = $mediaPlayer.NaturalDuration.TimeSpan.TotalSeconds;
                    Start-Sleep -Seconds $duration;
                    $mediaPlayer.Stop();
                    $mediaPlayer.Close()
                `];
                // command = 'powershell';
                // args = ['-c', `
                //     $player = New-Object System.Media.SoundPlayer('${currentFile}');
                //     $player.PlaySync();
                //     $player.Dispose()
                // `]

            } else if (isMac) {
                // macOS: Use built-in afplay
                command = 'afplay';
                args = [currentFile];
            } else if (isLinux) {
                // Linux: Try common audio players in order of preference
                // You could check which one exists first, but mpg123 is most common
                command = 'mpg123';
                args = ['-q', currentFile]; // -q for quiet mode
            } else {
                // Fallback for other Unix-like systems
                console.log('⚠️  Unknown platform, trying mpg123...');
                command = 'mpg123';
                args = ['-q', currentFile];
            }
            
            console.log(`🔊 Platform: ${process.platform} | Using: ${command}`);
            
            this.currentProcess = spawn(command, args);
            this.isPlaying = true;
            
            this.currentProcess.on('close', (code) => {
                this.isPlaying = false;
                this.currentProcess = null;
                
                if (!this.shouldStop && !this.isPaused) {
                    // Natural gap before next file
                    setTimeout(() => {
                        resolve(true);
                    }, this.gapDuration);
                } else {
                    resolve(false);
                }
            });
            
            this.currentProcess.on('error', (error) => {
                console.log(`❌ Audio playback error: ${error.message}`);
                console.log(`💡 Platform: ${process.platform} | Command: ${command}`);
                
                if (isWindows) {
                    console.log('💡 Windows: You might need to install a media player or try a different approach');
                } else if (isLinux) {
                    console.log('💡 Linux: Try installing mpg123: sudo apt install mpg123');
                }
                
                this.isPlaying = false;
                resolve(false);
            });
        });
    }
    setupKeyboardListener() {
        // Enable raw mode for immediate key detection
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        
        process.stdin.on('data', (key) => {
            const keyStr = key.toString().toLowerCase();
            
            switch (keyStr) {
                case ' ': // Spacebar
                    this.togglePause();
                    break;
                case 's':
                    this.stop();
                    break;
                case 'r':
                    this.repeat();
                    break;
                case 'n':
                    this.next();
                    break;
                case 'p':
                    this.previous();
                    break;
                case '?':
                    this.showHelp();
                    break;
                case '\u0003': // Ctrl+C
                    this.stop();
                    process.exit(0);
                    break;
            }
        });
    }
    
    togglePause() {
        if (this.isPlaying && this.currentProcess) {
            // Kill current playback to pause
            this.currentProcess.kill();
            this.isPaused = true;
            this.isPlaying = false;
            console.log('\n⏸ PAUSED - Press SPACE to resume');
        } else if (this.isPaused) {
            // Resume from current file
            this.isPaused = false;
            console.log('\n▶ RESUMING...');
            this.playCurrentFile().then(() => {
                if (!this.shouldStop) {
                    this.currentIndex++;
                    this.startPlayback();
                }
            });
        }
    }
    
    stop() {
        this.shouldStop = true;
        this.isPaused = false;
        if (this.currentProcess) {
            this.currentProcess.kill();
        }
        console.log('\n⏹ STOPPING PREVIEW...');
    }
    
    repeat() {
        if (this.currentProcess) {
            this.currentProcess.kill();
        }
        console.log('\n🔄 REPEATING CURRENT FILE...');
        this.isPaused = false;
        this.playCurrentFile().then(() => {
            if (!this.shouldStop) {
                this.currentIndex++;
                this.startPlayback();
            }
        });
    }
    
    next() {
        if (this.currentProcess) {
            this.currentProcess.kill();
        }
        if (this.currentIndex < this.audioFiles.length - 1) {
            this.currentIndex++;
            console.log('\n⏩ NEXT FILE...');
            this.isPaused = false;
            this.playCurrentFile().then(() => {
                if (!this.shouldStop) {
                    this.currentIndex++;
                    this.startPlayback();
                }
            });
        } else {
            console.log('\n⏹ REACHED END OF PLAYLIST');
        }
    }
    
    previous() {
        if (this.currentProcess) {
            this.currentProcess.kill();
        }
        if (this.currentIndex > 0) {
            this.currentIndex--;
            console.log('\n⏪ PREVIOUS FILE...');
            this.isPaused = false;
            this.playCurrentFile().then(() => {
                if (!this.shouldStop) {
                    this.currentIndex++;
                    this.startPlayback();
                }
            });
        } else {
            console.log('\n⏹ ALREADY AT FIRST FILE');
        }
    }
    
    showHelp() {
        console.log('\n📋 HELP:');
        console.log('  SPACE = Pause/Resume current file');
        console.log('  S = Stop preview completely');
        console.log('  R = Repeat current file');
        console.log('  N = Skip to next file');
        console.log('  P = Go to previous file');
        console.log('  ? = Show this help');
        console.log('  Ctrl+C = Exit');
    }
    
    async startPlayback() {
        while (this.currentIndex < this.audioFiles.length && !this.shouldStop) {
            const shouldContinue = await this.playCurrentFile();
            
            if (!shouldContinue || this.isPaused) {
                break;
            }
            
            this.currentIndex++;
        }
        
        if (!this.shouldStop && !this.isPaused) {
            console.log('\n✅ PREVIEW COMPLETE!');
            console.log(`Played all ${this.audioFiles.length} files.`);
        }
        
        this.cleanup();
    }
    
    async start() {
        this.audioFiles = this.getAudioFiles();
        
        if (this.audioFiles.length === 0) {
            console.log('❌ No MP3 files found in output directory!');
            console.log('Run generate-audio.js first to create audio files.');
            return;
        }
        
        console.log(`\n🎵 Found ${this.audioFiles.length} audio files`);
        console.log('Starting continuous playback...\n');
        
        await this.startPlayback();
    }
    
    cleanup() {
        if (this.currentProcess) {
            this.currentProcess.kill();
        }
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }
        this.rl.close();
    }
}

// Main execution
async function main() {
    // Check if we're in the right directory
    try {
        const outputDir = getProjectPath('output');
        if (!fs.existsSync(outputDir)) {
            console.log('❌ Output directory not found!');
            console.log('Make sure you\'re running from the project root.');
            process.exit(1);
        }
    } catch (error) {
        console.log('❌ Project structure error:', error.message);
        process.exit(1);
    }
    
    const preview = new AudioPreview();
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        preview.cleanup();
        process.exit(0);
    });
    
    await preview.start();
}

// Run if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = AudioPreview;