'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMessages } from 'next-intl';
import { Mic, MicOff, MapPin, Image, Send, Loader2, CheckCircle, AlertCircle, Square } from 'lucide-react';
import { CATEGORIES, LANGUAGES, type Category, type Language } from '@/lib/types';

const LANG_MAP: Record<string, string> = {
  en: 'en-US', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN',
  mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN', or: 'or-IN', pa: 'pa-IN', as: 'as-IN',
};

interface SubmissionFormProps {
  defaultLocale: string;
}

export function SubmissionForm({ defaultLocale }: SubmissionFormProps) {
  const messages = useMessages();
  const router = useRouter();

  const cats = (messages as any)?.submit?.form?.categories || {};
  const labels = {
    title: (messages as any)?.submit?.title || 'Submit Development Request',
    subtitle: (messages as any)?.submit?.subtitle || '',
    category: (messages as any)?.submit?.form?.category || 'Category',
    language: (messages as any)?.submit?.form?.language || 'Language',
    voiceHint: (messages as any)?.submit?.form?.voiceHint || 'Tap to speak your request',
    startRecording: (messages as any)?.submit?.form?.startRecording || 'Start Recording',
    stopRecording: (messages as any)?.submit?.form?.stopRecording || 'Stop Recording',
    listening: (messages as any)?.submit?.form?.listening || 'Listening...',
    photoUpload: (messages as any)?.submit?.form?.photoUpload || 'Upload Photo (optional)',
    photoHint: (messages as any)?.submit?.form?.photoHint || 'Photo of the issue',
    location: (messages as any)?.submit?.form?.location || 'Location',
    useCurrentLocation: (messages as any)?.submit?.form?.useCurrentLocation || 'Use Current Location',
    submit: (messages as any)?.submit?.form?.submit || 'Submit Request',
    submitting: (messages as any)?.submit?.form?.submitting || 'Submitting...',
    success: (messages as any)?.submit?.form?.success || 'Request submitted successfully!',
    error: (messages as any)?.submit?.form?.error || 'Failed to submit. Please try again.',
  };

  const [category, setCategory] = useState<Category>('other');
  const [language, setLanguage] = useState<Language>(defaultLocale as Language);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const recognitionRef = useRef(null as any);
  const timerRef = useRef<any>(null);

  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[language] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = voiceTranscript ? voiceTranscript + ' ' : '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text + ' ';
        } else {
          interimTranscript += text;
        }
      }
      setVoiceTranscript(finalTranscript.trim() + (interimTranscript ? ' ' + interimTranscript : ''));
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setRecordingTime(0);

    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, [language, voiceTranscript]);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const handlePhotoUpload = async (file: File) => {
    setPhoto(file);
    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(preview);
      await worker.terminate();
      setOcrText(text);
    } catch (error) {
      console.error('OCR failed:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`,
        });
      },
      () => alert('Could not get location')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!voiceTranscript.trim() && !photo && !ocrText.trim()) {
      setErrorMessage('Please record your voice or upload a photo');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const payload: Record<string, any> = {
        text_input: voiceTranscript,
        voice_transcript: voiceTranscript,
        ocr_text: ocrText,
        category,
        language,
        source: 'web',
        session_id: crypto.randomUUID(),
      };
      if (location) {
        payload.latitude = location.lat;
        payload.longitude = location.lng;
        payload.location_name = location.name;
      }

      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');

      setSubmitStatus('success');
      setVoiceTranscript('');
      setPhoto(null);
      setPhotoPreview(null);
      setOcrText('');
      setLocation(null);

      setTimeout(() => {
        setSubmitStatus('idle');
        router.refresh();
      }, 3000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error?.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [photoPreview]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const selectedLang = LANGUAGES.find(l => l.value === language);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      {/* Language selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            type="button"
            onClick={() => setLanguage(lang.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              language === lang.value
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {lang.nativeLabel}
          </button>
        ))}
      </div>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>{cats[cat.value] || cat.label}</option>
        ))}
      </select>

      {/* BIG Voice Recording Button */}
      <div className="flex flex-col items-center py-6">
        <button
          type="button"
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          disabled={isSubmitting}
          className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-lg ${
            isRecording
              ? 'bg-red-500 text-white scale-110 shadow-red-200 animate-pulse'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-200'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-10 h-10 mb-2" fill="currentColor" />
              <span className="text-sm font-medium">Stop</span>
              <span className="text-xs mt-1 opacity-80">{formatTime(recordingTime)}</span>
            </>
          ) : (
            <>
              <Mic className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">{labels.startRecording}</span>
            </>
          )}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-500 rounded-full animate-pulse"
                  style={{
                    height: `${12 + Math.random() * 20}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-red-600 font-medium">{labels.listening}</span>
          </div>
        )}

        {!isRecording && !voiceTranscript && (
          <p className="text-sm text-gray-500 mt-3">{labels.voiceHint}</p>
        )}
      </div>

      {/* Voice transcript display */}
      {voiceTranscript && (
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">{voiceTranscript}</p>
          <button
            type="button"
            onClick={() => setVoiceTranscript('')}
            className="text-xs text-red-500 hover:text-red-700 mt-2"
          >
            Clear recording
          </button>
        </div>
      )}

      {/* Photo upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{labels.photoUpload}</label>
        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
            photo ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => !photo && document.getElementById('photo-upload')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files[0]?.type.startsWith('image/')) {
              handlePhotoUpload(e.dataTransfer.files[0]);
            }
          }}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
          />
          {photoPreview ? (
            <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoPreview(null); setOcrText(''); }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >x</button>
            </div>
          ) : (
            <>
              <Image className="w-8 h-8 mx-auto text-gray-400 mb-1" />
              <p className="text-sm text-gray-500">{labels.photoHint}</p>
            </>
          )}
        </div>
        {ocrText && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800"><strong>OCR:</strong> {ocrText}</p>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors text-sm"
        >
          <MapPin className="w-4 h-4" />
          {labels.useCurrentLocation}
        </button>
        {location && (
          <span className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {location.name}
          </span>
        )}
      </div>

      {/* Status messages */}
      {submitStatus === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{labels.success}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{errorMessage || labels.error}</span>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting || (!voiceTranscript && !photo)}
        className="w-full py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {labels.submitting}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {labels.submit}
          </>
        )}
      </button>
    </form>
  );
}