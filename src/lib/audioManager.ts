/**
 * AudioManager — Singleton Jazz Music Player
 * Handles luxury jazz background music with smooth fade in/out.
 * Uses HTML5 Audio API. Auto-plays when user triggers first interaction.
 *
 * Jazz tracks from Bensound (https://www.bensound.com) — free for non-commercial use with attribution.
 */

const JAZZ_TRACKS = [
  "https://freetouse.com/music/download/Johny%20Grimes/Whisper%20Of%20Hope?format=mp3",
];

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;
  private _isPlaying = false;
  private _currentTrack = 0;
  private _targetVolume = 0.28; // Subtle, luxury-appropriate volume

  private ensureAudio() {
    if (typeof window === "undefined") return;
    if (!this.audio) {
      this.audio = new Audio();
      this.audio.loop = true;
      this.audio.volume = 0;
      this.audio.preload = "auto";
      this.audio.crossOrigin = "anonymous";
      this.audio.src = JAZZ_TRACKS[this._currentTrack];

      // On track end (if loop fails), go to next track
      this.audio.addEventListener("ended", () => {
        this._currentTrack = (this._currentTrack + 1) % JAZZ_TRACKS.length;
        if (this.audio) {
          this.audio.src = JAZZ_TRACKS[this._currentTrack];
          this.audio.play().catch(() => { });
        }
      });
    }
  }

  /** Fade audio volume smoothly */
  private fadeTo(targetVol: number, durationMs = 2000, onDone?: () => void) {
    if (!this.audio) return;

    if (this.fadeInterval) clearInterval(this.fadeInterval);

    const startVol = this.audio.volume;
    const steps = 40;
    const stepDuration = durationMs / steps;
    const stepSize = (targetVol - startVol) / steps;
    let step = 0;

    this.fadeInterval = setInterval(() => {
      step++;
      if (!this.audio) return;
      const nextVol = Math.min(1, Math.max(0, startVol + stepSize * step));
      this.audio.volume = nextVol;

      if (step >= steps) {
        clearInterval(this.fadeInterval!);
        this.fadeInterval = null;
        onDone?.();
      }
    }, stepDuration);
  }

  /** Start playing jazz music with gentle fade-in */
  play() {
    if (typeof window === "undefined") return;
    this.ensureAudio();
    if (!this.audio || this._isPlaying) return;

    this._isPlaying = true;
    this.audio.volume = 0;
    this.audio.play().then(() => {
      this.fadeTo(this._targetVolume, 2500);
    }).catch((err) => {
      console.warn("Jazz audio play blocked:", err);
      this._isPlaying = false;
    });
  }

  /** Pause music with fade-out */
  pause() {
    if (!this.audio || !this._isPlaying) return;
    this._isPlaying = false;

    this.fadeTo(0, 1000, () => {
      this.audio?.pause();
    });
  }

  /** Toggle play/pause */
  toggle() {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /** Check current playing state */
  get isPlaying() {
    return this._isPlaying;
  }

  /** Set volume (0–1), applies instantly */
  setVolume(vol: number) {
    this._targetVolume = Math.min(1, Math.max(0, vol));
    if (this.audio && this._isPlaying) {
      this.fadeTo(this._targetVolume, 500);
    }
  }

  /** Skip to next jazz track */
  nextTrack() {
    if (!this.audio) return;
    this._currentTrack = (this._currentTrack + 1) % JAZZ_TRACKS.length;
    const wasPlaying = this._isPlaying;

    this.fadeTo(0, 600, () => {
      if (!this.audio) return;
      this.audio.src = JAZZ_TRACKS[this._currentTrack];
      this.audio.volume = 0;
      if (wasPlaying) {
        this.audio.play().then(() => {
          this.fadeTo(this._targetVolume, 1500);
        }).catch(() => { });
      }
    });
  }

  /** Destroy audio instance */
  destroy() {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    if (this.audio) {
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this._isPlaying = false;
  }
}

// Singleton instance — safe for client-side use
let _audioManager: AudioManager | null = null;

export const getAudioManager = (): AudioManager => {
  if (!_audioManager) {
    _audioManager = new AudioManager();
  }
  return _audioManager;
};
