import pygame
import os
import glob
import time
import sys

def get_audio_files(output_dir="../output"):
    """Get all MP3 files from output directory, sorted by number"""
    pattern = os.path.join(output_dir, "*.mp3")
    files = glob.glob(pattern)
    
    # Sort by the number at the start of filename
    files.sort(key=lambda x: int(os.path.basename(x).split('_')[0]))
    return files

def extract_speaker_from_filename(filename):
    """Extract speaker name from filename like '001_laura.mp3'"""
    base = os.path.basename(filename)
    if '_' in base:
        return base.split('_')[1].replace('.mp3', '').title()
    return "Unknown"

def preview_audio_files():
    """Main preview function"""
    # Initialize pygame mixer
    pygame.mixer.init()
    
    # Get all audio files
    audio_files = get_audio_files()
    
    if not audio_files:
        print("No MP3 files found in 'output' directory!")
        return
    
    print(f"Found {len(audio_files)} audio files to preview")
    print("\nControls:")
    print("  SPACEBAR = Pause/Resume current file")
    print("  ENTER = Skip to next file")
    print("  R = Restart from current file")
    print("  Q = Quit")
    print("  ? = Show this help\n")
    
    current_index = 0
    
    while current_index < len(audio_files):
        current_file = audio_files[current_index]
        speaker = extract_speaker_from_filename(current_file)
        file_num = os.path.basename(current_file).split('_')[0]
        
        print(f"\n[{current_index + 1}/{len(audio_files)}] Playing: {file_num}_{speaker.lower()}.mp3")
        
        # Load and play the audio file
        try:
            pygame.mixer.music.load(current_file)
            pygame.mixer.music.play()
            
            # Wait for user input while audio plays
            while True:
                if not pygame.mixer.music.get_busy():
                    # Audio finished, move to next
                    current_index += 1
                    break
                
                # Check for user input (non-blocking)
                try:
                    user_input = input().strip().lower()
                    
                    if user_input == 'q':
                        pygame.mixer.music.stop()
                        print("Preview stopped.")
                        return
                    
                    elif user_input == '':  # ENTER key
                        pygame.mixer.music.stop()
                        current_index += 1
                        break
                    
                    elif user_input == ' ':  # SPACEBAR
                        if pygame.mixer.music.get_busy():
                            pygame.mixer.music.pause()
                            print("Paused. Press SPACEBAR again to resume.")
                        else:
                            pygame.mixer.music.unpause()
                            print("Resumed.")
                    
                    elif user_input == 'r':  # Restart from current
                        pygame.mixer.music.stop()
                        print(f"Restarting from file {current_index + 1}")
                        break
                    
                    elif user_input == '?':  # Help
                        print("\nControls:")
                        print("  SPACEBAR = Pause/Resume")
                        print("  ENTER = Next file")
                        print("  R = Restart from current")
                        print("  Q = Quit")
                        print("  ? = Show help\n")
                    
                    else:
                        print("Unknown command. Press ? for help.")
                
                except EOFError:
                    # Handle Ctrl+C or input issues
                    time.sleep(0.1)
                    continue
        
        except pygame.error as e:
            print(f"Error playing {current_file}: {e}")
            current_index += 1
            continue
    
    print(f"\nPreview complete! Played {len(audio_files)} files.")
    pygame.mixer.quit()

if __name__ == "__main__":
    print("Audio Preview Tool")
    print("==================")
    
    # Check if output directory exists
    if not os.path.exists("../output"):
        print("Error: '../output' directory not found!")
        print("Make sure you're running this from the script-files directory.")
        sys.exit(1)
    
    try:
        preview_audio_files()
    except KeyboardInterrupt:
        print("\nPreview interrupted by user.")
        pygame.mixer.quit()
    except Exception as e:
        print(f"Error: {e}")
        pygame.mixer.quit()