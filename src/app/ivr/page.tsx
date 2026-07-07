'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneFrame } from '@/components/ivr/PhoneFrame';
import { CallScreen } from '@/components/ivr/CallScreen';
import { LanguageSelector } from '@/components/ivr/LanguageSelector';
import { PhoneKeypad } from '@/components/ivr/PhoneKeypad';
import { ProcessingScreen } from '@/components/ivr/ProcessingScreen';
import { SuccessScreen } from '@/components/ivr/SuccessScreen';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { uploadAudioToStorage } from '@/lib/firebase';
import { getIVRPrompts, getQuestionText, CATEGORY_VOICE } from '@/lib/ivr-prompts';
import { playBeep, playRecordBeep, playCallConnected, playSuccessTone, playErrorTone } from '@/lib/ivr-sounds';
import type { IVRLanguage, IVRCallStep, IVRQuestionType, Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Mic, MicOff, Play, Square, Trash2, RotateCcw, SkipForward, Volume2 } from 'lucide-react';
import Link from 'next/link';

const QUESTION_ORDER: IVRQuestionType[] = ['problem', 'location'];

const CATEGORIES: { value: Category; key: string; label: string; icon: string }[] = [
  { value: 'healthcare', key: '1', label: 'Healthcare', icon: '🏥' },
  { value: 'education', key: '2', label: 'Education', icon: '🎓' },
  { value: 'roads', key: '3', label: 'Roads & Transport', icon: '🛣️' },
  { value: 'water', key: '4', label: 'Water Supply', icon: '💧' },
  { value: 'sanitation', key: '5', label: 'Sanitation', icon: '🧹' },
  { value: 'electricity', key: '6', label: 'Electricity', icon: '⚡' },
  { value: 'employment', key: '7', label: 'Employment', icon: '💼' },
  { value: 'other', key: '8', label: 'Other', icon: '📋' },
];

interface RecordedAnswer {
  type: IVRQuestionType;
  blob: Blob;
  url: string;
  transcript: string;
}

export default function IVRPage() {
  const router = useRouter();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const { isRecording, recordingTime, audioBlob, audioUrl, startRecording, stopRecording, clearRecording, error: recorderError } = useMediaRecorder();
  const { isListening, transcript, interimTranscript, start: startSTT, stop: stopSTT, reset: resetSTT, isSupported: sttSupported } = useSpeechRecognition();

  const [step, setStep] = useState<IVRCallStep>('ringing');
  const [selectedLanguage, setSelectedLanguage] = useState<IVRLanguage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('other');
  const [currentQuestion, setCurrentQuestion] = useState<IVRQuestionType>('problem');
  const [answers, setAnswers] = useState<RecordedAnswer[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const [callTime, setCallTime] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState(false);

  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const uploadGuardRef = useRef(false);

  const prompts = selectedLanguage ? getIVRPrompts(selectedLanguage) : getIVRPrompts('en');

  const clearTimer = useCallback(() => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      cancel();
      stopSTT();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (audioPlayerRef.current) { audioPlayerRef.current.pause(); audioPlayerRef.current = null; }
    };
  }, [clearTimer, cancel, stopSTT]);

  // Call timer
  useEffect(() => {
    if (step !== 'ringing') {
      callTimerRef.current = setInterval(() => setCallTime((t) => t + 1), 1000);
      return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
    }
  }, [step]);

  // Auto-advance: ringing → connected → welcome
  useEffect(() => {
    if (step === 'ringing') {
      stepTimerRef.current = setTimeout(() => {
        playCallConnected();
        setStep('connected');
      }, 2000);
      return () => clearTimer();
    }
    if (step === 'connected') {
      stepTimerRef.current = setTimeout(() => setStep('welcome'), 1000);
      return () => clearTimer();
    }
  }, [step, clearTimer]);

  // Welcome message — plays in English before language selection
  useEffect(() => {
    if (step === 'welcome') {
      const safetyTimeout = setTimeout(() => {
        setStep('languageSelect');
      }, 20000);
      speak(prompts.welcome, 'en').then(() => {
        return speak(prompts.languageInstruction, 'en');
      }).then(() => {
        clearTimeout(safetyTimeout);
        stepTimerRef.current = setTimeout(() => setStep('languageSelect'), 500);
      });
      return () => { clearTimer(); clearTimeout(safetyTimeout); };
    }
  }, [step, speak, clearTimer, prompts.welcome, prompts.languageInstruction]);

  // After language selected: speak welcome in that language, then start
  useEffect(() => {
    if (step === 'questionPrompt' && selectedLanguage) {
      const qNum = QUESTION_ORDER.indexOf(currentQuestion) + 1;
      const qText = getQuestionText(currentQuestion, selectedLanguage);
      const safetyTimeout = setTimeout(() => {
        playBeep();
        setStep('keypadMenu');
      }, 30000);
      speak(prompts.questionPrefix(qNum, QUESTION_ORDER.length), selectedLanguage).then(() => {
        return speak(qText, selectedLanguage);
      }).then(() => {
        return speak(prompts.keypadMenuInstruction, selectedLanguage);
      }).then(() => {
        clearTimeout(safetyTimeout);
        playBeep();
        stepTimerRef.current = setTimeout(() => setStep('keypadMenu'), 500);
      });
      return () => { clearTimer(); clearTimeout(safetyTimeout); };
    }
  }, [step, currentQuestion, selectedLanguage, speak, clearTimer, prompts]);

  // Category selection voice
  useEffect(() => {
    if (step === 'categorySelect' && selectedLanguage) {
      speak(prompts.categoryPrompt, selectedLanguage).then(() => {
        return speak(getQuestionText('category', selectedLanguage), selectedLanguage);
      }).then(() => {
        return speak(CATEGORY_VOICE[selectedLanguage] || CATEGORY_VOICE.en, selectedLanguage);
      }).then(() => {
        playBeep();
      });
      return () => clearTimer();
    }
  }, [step, selectedLanguage, speak, clearTimer, prompts]);

  const handleLanguageSelect = useCallback((lang: IVRLanguage) => {
    setSelectedLanguage(lang);
    clearTimer();
    cancel();
    setTimeout(() => {
      setStep('questionPrompt');
      setCurrentQuestion('problem');
    }, 300);
  }, [clearTimer, cancel]);

  // Play audio recording
  const playRecording = useCallback((url: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    const audio = new Audio(url);
    audioPlayerRef.current = audio;
    setIsPlayingBack(true);
    audio.onended = () => setIsPlayingBack(false);
    audio.onerror = () => setIsPlayingBack(false);
    audio.play().catch(() => setIsPlayingBack(false));
  }, []);

  // Keypad handler for recording menu
  const handleKeypadPress = useCallback(async (key: string) => {
    if (!selectedLanguage) return;
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 200);

    switch (key) {
      case '1': // Start recording
        if (isRecording) return;
        clearRecording();
        resetSTT();
        playRecordBeep();
        await speak(prompts.recordingStarted, selectedLanguage);
        startRecording();
        if (sttSupported) startSTT(selectedLanguage);
        break;

      case '2': // Stop recording
        if (!isRecording) return;
        stopRecording();
        if (sttSupported) stopSTT();
        await speak(prompts.recordingStopped, selectedLanguage);
        break;

      case '3': // Play recording
        if (!audioBlob || !audioUrl) {
          await speak(prompts.noRecording, selectedLanguage);
          return;
        }
        await speak(prompts.playingRecording, selectedLanguage);
        playRecording(audioUrl);
        break;

      case '4': // Delete recording
        if (!audioBlob) {
          await speak(prompts.noRecording, selectedLanguage);
          return;
        }
        clearRecording();
        resetSTT();
        await speak(prompts.recordingDeleted, selectedLanguage);
        break;

      case '5': // Re-record
        if (audioBlob) clearRecording();
        resetSTT();
        playRecordBeep();
        await speak(prompts.pleaseRerecord, selectedLanguage);
        startRecording();
        if (sttSupported) startSTT(selectedLanguage);
        break;

      case '6': // Next
        if (!audioBlob) {
          playErrorTone();
          await speak(prompts.noRecording, selectedLanguage);
          return;
        }
        // Save answer with transcript
        setAnswers((prev) => [
          ...prev.filter((a) => a.type !== currentQuestion),
          { type: currentQuestion, blob: audioBlob, url: audioUrl || '', transcript: transcript || '' },
        ]);
        clearRecording();
        resetSTT();
        await speak(prompts.movingToNext, selectedLanguage);

        const currentIndex = QUESTION_ORDER.indexOf(currentQuestion);
        if (currentIndex < QUESTION_ORDER.length - 1) {
          setCurrentQuestion(QUESTION_ORDER[currentIndex + 1]);
          setStep('questionPrompt');
        } else {
          setStep('categorySelect');
        }
        break;
    }
  }, [selectedLanguage, isRecording, audioBlob, audioUrl, currentQuestion, prompts, startRecording, stopRecording, clearRecording, speak, playRecording, sttSupported, startSTT, stopSTT, resetSTT, transcript]);

  // Category keypad handler
  const handleCategoryKeypress = useCallback(async (key: string) => {
    if (!selectedLanguage) return;
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 200);

    const cat = CATEGORIES.find((c) => c.key === key);
    if (cat) {
      setSelectedCategory(cat.value);
      playSuccessTone();
      await speak(`Category selected: ${cat.label}`, selectedLanguage);
      stepTimerRef.current = setTimeout(() => setStep('uploading'), 500);
    }
  }, [selectedLanguage, speak]);

  // Final submit
  useEffect(() => {
    if (step !== 'uploading' || answers.length === 0 || uploadGuardRef.current) return;
    uploadGuardRef.current = true;

    const submitAll = async () => {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('Uploading recording...');
      setError(null);

      try {
        // Try upload first recording
        let audioUrls: string[] = [];
        const firstAnswer = answers[0];
        if (firstAnswer) {
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(2, 10);
          const filePath = `ivr-audio/ivr_${firstAnswer.type}_${timestamp}_${randomId}.webm`;
          try {
            setUploadProgress(30);
            const uploadPromise = uploadAudioToStorage(firstAnswer.blob, filePath);
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Upload timeout')), 15000)
            );
            const url = await Promise.race([uploadPromise, timeoutPromise]);
            audioUrls = [url];
          } catch {
            console.log('[IVR] Audio upload failed — submitting without audio');
          }
        }

        setUploadProgress(60);
        setUploadStatus('Saving complaint...');

        const categoryLabels: Record<string, string> = {
          healthcare: 'Healthcare', education: 'Education', roads: 'Roads & Transport',
          water: 'Water Supply', sanitation: 'Sanitation', electricity: 'Electricity',
          employment: 'Employment', other: 'Other',
        };
        const categoryLabel = categoryLabels[selectedCategory] || selectedCategory;
        const transcript = [
          `Category: ${categoryLabel}`,
          ...answers.map((a) => `[${a.type.toUpperCase()}]: ${a.transcript || 'Audio recorded'}`),
        ].join('\n');

        const response = await fetch('/api/ivr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: selectedLanguage,
            audioUrls,
            transcript,
            category: selectedCategory,
            session_id: crypto.randomUUID(),
          }),
        });

        setUploadProgress(90);

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to submit complaint');
        }

        const result = await response.json();
        setComplaintId(result.submission?.id || `JS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`);
        setUploadProgress(100);

        if (selectedLanguage) {
          await speak(prompts.uploadSuccess, selectedLanguage);
          await speak(prompts.completionMessage, selectedLanguage);
        }
        playSuccessTone();

        setStep('processing');
        setTimeout(() => setStep('success'), 6000);
      } catch (err) {
        console.error('[IVR] Submit error:', err);
        if (selectedLanguage) await speak(prompts.uploadFailed, selectedLanguage);
        playErrorTone();
        setError(err instanceof Error ? err.message : 'Failed to submit');
        setStep('keypadMenu');
        uploadGuardRef.current = false;
      } finally {
        setIsUploading(false);
      }
    };

    submitAll();
  }, [step, answers, selectedLanguage, selectedCategory, prompts]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-xl text-sm transition-colors"
          style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
      </div>

      <PhoneFrame>
        {step === 'ringing' && <CallScreen status="ringing" />}
        {step === 'connected' && <CallScreen status="connected" />}

        {/* Language Selection */}
        {step === 'languageSelect' && (
          <LanguageSelector selectedLanguage={selectedLanguage} onSelect={handleLanguageSelect} />
        )}

        {/* Welcome */}
        {step === 'welcome' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/20">
                <Phone className="w-8 h-8 text-green-400" />
              </div>
              {isSpeaking && [0, 1, 2].map((i) => (
                <motion.div key={i} className="absolute inset-0 rounded-full border border-green-500/20"
                  initial={{ scale: 1, opacity: 0.5 }} animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  style={{ width: 80, height: 80, top: '50%', left: '50%', marginTop: -40, marginLeft: -40 }} />
              ))}
            </motion.div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to JanSankalp AI</h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">{prompts.welcome}</p>
          </div>
        )}

        {/* Question Prompt */}
        {step === 'questionPrompt' && selectedLanguage && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                <Volume2 className="w-7 h-7 text-blue-400" />
              </div>
            </motion.div>
            <p className="text-xs text-gray-500 mb-2">
              Question {QUESTION_ORDER.indexOf(currentQuestion) + 1} of {QUESTION_ORDER.length}
            </p>
            <h2 className="text-lg font-bold text-white text-center mb-4">
              {getQuestionText(currentQuestion, selectedLanguage)}
            </h2>
            {isSpeaking ? (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} className="w-1 bg-blue-400 rounded-full"
                      animate={{ height: [4, 14, 4] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }} />
                  ))}
                </div>
                <span className="text-blue-400 text-sm">Listening...</span>
              </div>
            ) : (
              <span className="text-yellow-400 text-sm">Get ready to record...</span>
            )}
          </div>
        )}

        {/* Keypad Menu */}
        {step === 'keypadMenu' && selectedLanguage && (
          <div className="flex-1 flex flex-col items-center px-4 py-4">
            {/* Call header */}
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Call Active</span>
              </div>
              <span className="text-gray-400 font-mono text-sm">{formatTime(callTime)}</span>
            </div>

            {/* Current question */}
            <div className="text-center mb-3">
              <p className="text-xs text-gray-500">
                Q{QUESTION_ORDER.indexOf(currentQuestion) + 1}/{QUESTION_ORDER.length}
              </p>
              <p className="text-sm font-medium text-white truncate max-w-xs">
                {getQuestionText(currentQuestion, selectedLanguage)}
              </p>
            </div>

            {/* Recording status */}
            <div className="flex items-center gap-3 mb-3">
              {isRecording ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full border border-red-500/30">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 text-xs font-medium">{formatTime(recordingTime)}</span>
                  <Mic className="w-3 h-3 text-red-400" />
                </div>
              ) : audioBlob ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-400 text-xs font-medium">Recorded</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/20 rounded-full border border-gray-500/30">
                  <span className="text-gray-400 text-xs">No recording</span>
                </div>
              )}
              {isPlayingBack && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <Play className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-400 text-xs">Playing...</span>
                </div>
              )}
            </div>

            {/* Menu options */}
            <div className="grid grid-cols-3 gap-2 mb-4 w-full max-w-[280px]">
              {[
                { key: '1', icon: Mic, label: 'Record', color: 'text-green-400' },
                { key: '2', icon: Square, label: 'Stop', color: 'text-red-400' },
                { key: '3', icon: Play, label: 'Listen', color: 'text-blue-400' },
                { key: '4', icon: Trash2, label: 'Delete', color: 'text-orange-400' },
                { key: '5', icon: RotateCcw, label: 'Re-record', color: 'text-yellow-400' },
                { key: '6', icon: SkipForward, label: 'Next', color: 'text-purple-400' },
              ].map(({ key, icon: Icon, label, color }) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <span className={`text-[10px] font-medium ${color}`}>{key}</span>
                  <span className={`text-[10px] ${color}`}>{label}</span>
                </div>
              ))}
            </div>

            {/* Sound wave when recording */}
            {isRecording && (
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div key={i} className="w-1 bg-red-400 rounded-full"
                    animate={{ height: [4, 16 + Math.sin(i) * 8, 4] }}
                    transition={{ duration: 0.5 + i * 0.05, repeat: Infinity, delay: i * 0.05 }} />
                ))}
              </div>
            )}

            {/* Interim transcript */}
            {isRecording && interimTranscript && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="mb-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10 max-w-xs">
                <p className="text-[10px] text-blue-400 mb-0.5">Listening...</p>
                <p className="text-xs text-gray-300 leading-relaxed">{interimTranscript}</p>
              </motion.div>
            )}

            {/* Keypad */}
            <PhoneKeypad onKeyPress={handleKeypadPress} activeKey={activeKey} />

            {/* Error */}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-red-400 text-xs text-center mt-3">{error}</motion.p>
            )}
          </div>
        )}

        {/* Category Selection */}
        {step === 'categorySelect' && selectedLanguage && (
          <div className="flex-1 flex flex-col items-center px-4 py-4">
            <div className="flex items-center justify-between w-full mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Call Active</span>
              </div>
              <span className="text-gray-400 font-mono text-sm">{formatTime(callTime)}</span>
            </div>

            <h2 className="text-lg font-bold text-white text-center mb-2">Select Category</h2>
            <p className="text-xs text-gray-400 text-center mb-4">Press a number key (1-8)</p>

            <div className="grid grid-cols-2 gap-2 w-full max-w-[280px] mb-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-xs font-bold text-blue-400 w-5">{cat.key}</span>
                  <span className="text-sm">{cat.icon}</span>
                  <span className="text-xs text-gray-300">{cat.label}</span>
                </div>
              ))}
            </div>

            <PhoneKeypad onKeyPress={handleCategoryKeypress} activeKey={activeKey} />
          </div>
        )}

        {/* Uploading */}
        {step === 'uploading' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-6 border-4 border-blue-500 border-t-transparent rounded-full" />
            <h2 className="text-xl font-bold text-white mb-2">Uploading</h2>
            <p className="text-sm text-gray-400 mb-6">{uploadStatus}</p>
            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  animate={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">{uploadProgress}%</p>
            </div>
          </div>
        )}

        {step === 'processing' && <ProcessingScreen />}

        {step === 'success' && complaintId && (
          <SuccessScreen complaintId={complaintId} onReturnHome={() => router.push('/')} onTrackComplaint={() => router.push('/')} />
        )}
      </PhoneFrame>
    </div>
  );
}
