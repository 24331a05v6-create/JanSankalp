'use client';

import { motion } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useEffect, useMemo } from 'react';

interface RecordingPanelProps {
  onRecordingComplete: (blob: Blob, url: string) => void;
  isUploading: boolean;
  interimTranscript?: string;
}

const WAVE_HEIGHTS = [16, 24, 12, 28, 20, 14, 26, 18, 22, 10, 30, 15];
const WAVE_DURATIONS = [0.8, 0.65, 0.9, 0.7, 0.85, 0.6, 0.75, 0.95, 0.68, 0.82, 0.72, 0.88];

export function RecordingPanel({ onRecordingComplete, isUploading, interimTranscript }: RecordingPanelProps) {
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    error,
  } = useMediaRecorder();

  const waveBars = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      height: WAVE_HEIGHTS[i],
      duration: WAVE_DURATIONS[i],
    })),
  []);

  useEffect(() => {
    if (audioBlob && audioUrl) {
      onRecordingComplete(audioBlob, audioUrl);
    }
  }, [audioBlob, audioUrl, onRecordingComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/20">
          <Mic className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Record Your Complaint</h2>
        <p className="text-sm text-gray-400">Tap the microphone and speak clearly</p>
      </motion.div>

      <div className="relative mb-8">
        {isRecording && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full bg-red-500/20"
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut',
                }}
                style={{
                  width: '160px',
                  height: '160px',
                  top: '50%',
                  left: '50%',
                  marginTop: '-80px',
                  marginLeft: '-80px',
                }}
              />
            ))}
          </>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isUploading}
          className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl ${
            isRecording
              ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/40'
              : 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/40 hover:shadow-blue-500/60'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          ) : isRecording ? (
            <>
              <Square className="w-10 h-10 text-white" fill="currentColor" />
              <span className="text-white text-sm font-medium mt-2">Stop</span>
            </>
          ) : (
            <>
              <Mic className="w-12 h-12 text-white" />
              <span className="text-white text-sm font-medium mt-2">Tap to Record</span>
            </>
          )}
        </motion.button>
      </div>

      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-1.5">
            {waveBars.map((bar, i) => (
              <motion.div
                key={i}
                className="w-1 bg-red-400 rounded-full"
                animate={{
                  height: [4, bar.height, 4],
                }}
                transition={{
                  duration: bar.duration,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-mono text-lg font-semibold">
              {formatTime(recordingTime)}
            </span>
          </div>

          <span className="text-gray-400 text-sm">Recording...</span>

          {/* Real-time transcript */}
          {interimTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 max-w-xs"
            >
              <p className="text-xs text-blue-400 mb-1">Listening...</p>
              <p className="text-sm text-gray-300 leading-relaxed">{interimTranscript}</p>
            </motion.div>
          )}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <p className="text-red-400 text-sm text-center">{error}</p>
        </motion.div>
      )}

      {!isRecording && !audioBlob && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 bg-gray-600 rounded-full"
                style={{ height: `${8 + Math.sin(i * 0.8) * 6}px` }}
              />
            ))}
          </div>
          <p className="text-gray-500 text-xs">Speak about your issue</p>
        </motion.div>
      )}
    </div>
  );
}
