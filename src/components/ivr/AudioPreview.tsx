'use client';

import { motion } from 'framer-motion';
import { Play, Pause, Trash2, ArrowRight, RotateCcw } from 'lucide-react';
import { useState, useRef, useMemo } from 'react';

interface AudioPreviewProps {
  audioUrl: string;
  onContinue: () => void;
  onRetake: () => void;
  onDelete: () => void;
  isUploading: boolean;
}

const BAR_HEIGHTS = Array.from({ length: 20 }, (_, i) => 4 + Math.abs(Math.sin(i * 0.5)) * 16);
const ANIMATED_HEIGHTS = BAR_HEIGHTS.map((h) => [`${h}px`, `${4 + (h % 15)}px`, `${h}px`]);

export function AudioPreview({ audioUrl, onContinue, onRetake, onDelete, isUploading }: AudioPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bars = useMemo(() =>
    BAR_HEIGHTS.map((h, i) => ({
      height: h,
      animatedHeight: ANIMATED_HEIGHTS[i],
    })),
  []);

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
          <span className="text-2xl">🎧</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Audio Preview</h2>
        <p className="text-sm text-gray-400">Review your recording before submitting</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            disabled={isUploading}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" fill="currentColor" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
            )}
          </motion.button>

          <div className="flex-1">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-1.5">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-1">
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-1 bg-blue-400/60 rounded-full"
              style={{ height: `${bar.height}px` }}
              animate={
                isPlaying
                  ? { height: bar.animatedHeight }
                  : {}
              }
              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </motion.div>

      <div className="flex gap-3">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          disabled={isUploading}
          className="flex-1 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-5 h-5" />
          Delete
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetake}
          disabled={isUploading}
          className="flex-1 py-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-medium flex items-center justify-center gap-2 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-5 h-5" />
          Record Again
        </motion.button>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        disabled={isUploading}
        className="mt-4 w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Uploading...
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </div>
  );
}
