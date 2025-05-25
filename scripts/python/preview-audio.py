import pygame
import os
import glob
import time
import sys
import threading
import msvcrt  # Windows-specific for non-blocking keyboard input

class AudioPreview:
    def __init__(self):
        pygame.mixer.init()
        self.audio_files = []
        self.current_index = 0
        self.playing = False
        self.paused = False
        self.should_stop = False
        self.gap_duration = 1.5  # seconds between files
        
    def get_audio_files(self, output_dir="output"):
        """Get all MP3 files from output directory, sorted by number"""
        pattern = os.path.join(output_dir, "*.mp3")
        files = glob.glob(pattern)
        files.sort(key=lambda x: int(os.path.basename(x).split('_')[0]))
        return files
    
    def extract_info_from_filename(self, filename):
        """Extract speaker and number from filename"""
        base = os.path.basename(filename)
        if '_' in base:
            parts = base.split('_')
            number = parts[0]
            speaker = parts[1].replace('.mp3', '').title()
            return number, speaker
        return "000", "Unknown"
    
    def show_controls(self):
        """Display control instructions"""
        print("\n" + "="*60)
        print("AUDIO PREVIEW - Continuous Playback Mode")
        print("="*60)
        print("Controls (press key + ENTER):")
        print("  SPACEBAR = Pause/Resume")
        print("  B = Back (previous file)")
        print("  N = Next (skip current file)")
        print("  R = Repeat current file")
        print("  S = Stop preview")
        print("  ? = Show this help")
        print("="*60)
    
    def play_file(self, filepath):
        """Play a single audio file"""
        try:
            pygame.mixer.music.load(filepath)
            pygame.mixer.music.play()
            
            # Wait for file to finish or user intervention
            while pygame.mixer.music.get_busy() and not self.should_stop:
                if self.paused:
                    pygame.mixer.music.pause()
                    while self.paused and not self.should_stop:
                        time.sleep(0.1)
                    if not self.should_stop:
                        pygame.mixer.music.unpause()
                time.sleep(0.1)
                
        except pygame.error as e:
            print(f"Error playing file: {e}")
    
    def preview_continuous(self):
        """Main continuous preview function"""
        self.audio_files = self.get_audio_files()
        
        if not self.audio_files:
            print("No MP3 files found in 'output' directory!")
            return
        
        self.show_controls()
        print(f"\nFound {len(self.audio_files)} files. Starting continuous playback...\n")
        
        # Start keyboard listener in separate thread
        keyboard_thread = threading.Thread(target=self.keyboard_listener, daemon=True)
        keyboard_thread.start()
        
        self.playing = True
        
        while self.current_index < len(self.audio_files) and not self.should_stop:
            current_file = self.audio_files[self.current_index]
            number, speaker = self.extract_info_from_filename(current_file)
            
            print(f"[{self.current_index + 1}/{len(self.audio_files)}] Playing: {number}_{speaker.lower()}.mp3")
            
            self.play_file(current_file)
            
            if not self.should_stop:
                # Natural gap between files
                print(f"  ... gap ({self.gap_duration}s) ...")
                time.sleep(self.gap_duration)
                self.current_index += 1
        
        if not self.should_stop:
            print(f"\n✓ Preview complete! Played {len(self.audio_files)} files.")
        else:
            print(f"\n⏹ Preview stopped at file {self.current_index + 1}")
        
        self.playing = False
        pygame.mixer.quit()
    
    def keyboard_listener(self):
        """Listen for keyboard input (Windows-specific)"""
        while self.playing and not self.should_stop:
            if msvcrt.kbhit():
                key = msvcrt.getch().decode('utf-8').lower()
                
                if key == ' ':  # Spacebar
                    self.toggle_pause()
                elif key == 'b':  # Back
                    self.go_back()
                elif key == 'n':  # Next
                    self.go_next()
                elif key == 'r':  # Repeat
                    self.repeat_current()
                elif key == 's':  # Stop
                    self.stop_preview()
                elif key == '?':  # Help
                    self.show_controls()
            
            time.sleep(0.1)
    
    def toggle_pause(self):
        """Toggle pause/resume"""
        self.paused = not self.paused
        if self.paused:
            print("⏸ PAUSED - Press SPACEBAR to resume")
        else:
            print("▶ RESUMED")
    
    def go_back(self):
        """Go to previous file"""
        if self.current_index > 0:
            pygame.mixer.music.stop()
            self.current_index -= 1
            print(f"⏪ Going back to file {self.current_index + 1}")
        else:
            print("Already at first file")
    
    def go_next(self):
        """Skip to next file"""
        pygame.mixer.music.stop()
        print(f"⏩ Skipping to next file")
    
    def repeat_current(self):
        """Repeat current file"""
        pygame.mixer.music.stop()
        print(f"🔄 Repeating file {self.current_index + 1}")
    
    def stop_preview(self):
        """Stop the preview"""
        self.should_stop = True
        pygame.mixer.music.stop()
        print("⏹ Stopping preview...")

def main():
    print("Audio Preview Tool - Continuous Mode")
    print("====================================")
    
    # Check if output directory exists
    if not os.path.exists("output"):
        print("Error: 'output' directory not found!")
        print("Make sure you're running this from the project root directory.")
        sys.exit(1)
    
    try:
        preview = AudioPreview()
        preview.preview_continuous()
    except KeyboardInterrupt:
        print("\nPreview interrupted by user.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()