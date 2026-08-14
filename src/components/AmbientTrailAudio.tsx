import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles, Wind, Flame, CloudRain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type SoundPreset = "campfire" | "wind" | "rain";

export default function AmbientTrailAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [preset, setPreset] = useState<SoundPreset>("campfire");
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<{ stop: () => void }[]>([]);

  // Initialize or clean up Web Audio Synthesizer
  const stopAudio = () => {
    activeNodesRef.current.forEach((n) => {
      try {
        n.stop();
      } catch {
        // ignore
      }
    });
    activeNodesRef.current = [];
  };

  const startAudio = (selectedPreset: SoundPreset) => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      } else if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      if (selectedPreset === "campfire") {
        // Campfire: Low warm drone + soft crackle impulses
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(110, ctx.currentTime); // Low warm A2
        
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(220, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.12, ctx.currentTime);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();

        // White noise crackle buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Sparse randomized crackle sparks
          if (Math.random() > 0.994) {
            output[i] = (Math.random() * 2 - 1) * 0.8;
          } else {
            output[i] = (Math.random() * 2 - 1) * 0.02;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.setValueAtTime(1200, ctx.currentTime);
        noiseFilter.Q.setValueAtTime(3, ctx.currentTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);
        whiteNoise.start();

        activeNodesRef.current.push({
          stop: () => {
            try {
              osc.stop();
              whiteNoise.stop();
            } catch {
              // ignore
            }
          },
        });
      } else if (selectedPreset === "wind") {
        // Alpine Wind: Pink noise with sweeping lowpass filter
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
          b6 = white * 0.115926;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        // LFO to modulate wind frequency
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(250, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.35, ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(windGain);
        windGain.connect(masterGain);
        noiseSource.start();

        activeNodesRef.current.push({
          stop: () => {
            try {
              noiseSource.stop();
              lfo.stop();
            } catch {
              // ignore
            }
          },
        });
      } else if (selectedPreset === "rain") {
        // Rain: Soft rhythmic noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(950, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.28, ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(masterGain);
        noiseSource.start();

        activeNodesRef.current.push({
          stop: () => {
            try {
              noiseSource.stop();
            } catch {
              // ignore
            }
          },
        });
      }
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio(preset);
      setIsPlaying(true);
    }
  };

  const changePreset = (newPreset: SoundPreset) => {
    setPreset(newPreset);
    if (isPlaying) {
      startAudio(newPreset);
    }
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="mb-3 p-4 rounded-3xl bg-[#0b0c10]/95 backdrop-blur-2xl border border-white/15 shadow-2xl w-72 text-white"
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white">
                  Trail Soundscapes
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400/80 uppercase">Procedural</span>
            </div>

            <p className="text-[11px] text-zinc-400 mb-3.5 font-light leading-relaxed">
              Immerse in synthesized ambient nature audio while browsing expeditions.
            </p>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-3.5">
              <button
                onClick={() => changePreset("campfire")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-display ${
                  preset === "campfire"
                    ? "bg-amber-400 text-black shadow-md shadow-amber-500/20"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Campfire</span>
              </button>

              <button
                onClick={() => changePreset("wind")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-display ${
                  preset === "wind"
                    ? "bg-sky-400 text-black shadow-md shadow-sky-500/20"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Alpine</span>
              </button>

              <button
                onClick={() => changePreset("rain")}
                className={`flex flex-col items-center gap-1 p-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer font-display ${
                  preset === "rain"
                    ? "bg-emerald-400 text-black shadow-md shadow-emerald-500/20"
                    : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Rain</span>
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Volume2 className="w-3 h-3 text-zinc-400 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-[10px] font-mono text-zinc-400 w-7 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Pill */}
      <div className="flex items-center gap-2 bg-[#0b0c10]/90 backdrop-blur-xl border border-white/15 p-1.5 rounded-full shadow-2xl hover:border-amber-400/50 transition-colors">
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer font-display ${
            isPlaying
              ? "bg-amber-400 text-black shadow-lg shadow-amber-500/30"
              : "bg-white/10 text-white hover:bg-white/15"
          }`}
          title={isPlaying ? "Mute Trail Ambience" : "Play Trail Soundscape"}
        >
          {isPlaying ? (
            <>
              {/* Animated visualizer bars */}
              <div className="flex items-center gap-0.5 h-3.5">
                <span className="w-1 bg-black rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
                <span className="w-1 bg-black rounded-full animate-[bounce_0.8s_infinite_300ms] h-2" />
                <span className="w-1 bg-black rounded-full animate-[bounce_0.8s_infinite_200ms] h-3.5" />
              </div>
              <span>Ambience ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-300">Trail Audio</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Sound Options"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    </div>
  );
}
