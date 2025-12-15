import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { title: "Cyber City Rain", url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_8217a94420.mp3?filename=heavy-rain-105260.mp3" },
  { title: "Deep Focus White", url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3?filename=white-noise-8117.mp3" },
  { title: "Night Cafe", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cafe-ambience-15638.mp3" },
];

export const MediaPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying, trackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setTrackIndex((i) => (i + 1) % TRACKS.length);
  const prevTrack = () => setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);

  const currentTrack = TRACKS[trackIndex];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-3rem)]'}`}>
      <div 
        className="bg-[#1e1e2e]/90 backdrop-blur-md border-t border-[#313244] p-3 shadow-2xl flex flex-col md:flex-row items-center gap-4 max-w-screen-xl mx-auto rounded-t-2xl"
      >
        {/* Toggle Handle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1e1e2e] px-4 py-1 rounded-t-xl border border-[#313244] border-b-0 text-xs text-[#a6adc8] font-bold uppercase tracking-widest hover:text-white"
        >
          {isExpanded ? 'Hide' : 'Sonic Layer'}
        </button>

        {/* Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[#313244] rounded-lg flex items-center justify-center text-[#89b4fa]">
            <Music size={20} className={isPlaying ? "animate-pulse" : ""} />
          </div>
          <div className="truncate">
            <div className="font-bold text-white text-sm">{currentTrack.title}</div>
            <div className="text-[10px] text-[#a6adc8] uppercase tracking-wider">LoFi Frequency</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={prevTrack} className="text-[#a6adc8] hover:text-white"><SkipBack size={20} /></button>
          <button 
            onClick={togglePlay} 
            className="w-10 h-10 rounded-full bg-[#89b4fa] text-[#1e1e2e] flex items-center justify-center hover:bg-white transition-colors"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
          </button>
          <button onClick={nextTrack} className="text-[#a6adc8] hover:text-white"><SkipForward size={20} /></button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-32 hidden md:flex">
          <button onClick={() => setVolume(v => v === 0 ? 0.5 : 0)} className="text-[#585b70] hover:text-white">
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input 
            type="range" min="0" max="1" step="0.1" 
            value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-[#313244] rounded-full appearance-none cursor-pointer accent-[#89b4fa]"
          />
        </div>

        <audio ref={audioRef} src={currentTrack.url} loop onEnded={nextTrack} />
      </div>
    </div>
  );
};