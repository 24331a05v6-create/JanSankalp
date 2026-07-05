'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useMessages } from 'next-intl';
import { Mic, MicOff, MapPin, Image, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { CATEGORIES, LANGUAGES, type Category, type Language } from '@/lib/types';

interface SubmissionFormProps {
  defaultLocale: string;
}

export function SubmissionForm({ defaultLocale }: SubmissionFormProps) {
  const t = useTranslations('submit.form');
  const messages = useMessages();
  const router = useRouter();
  
  const categoryLabels: Record<string, string> = {};
  const cats = (messages as any)?.submit?.form?.categories;
  if (cats) {
    Object.keys(cats).forEach(key => {
      categoryLabels[key] = cats[key];
    });
  }
  
  const [category, setCategory] = useState<Category>('other');
  const [language, setLanguage] = useState<Language>(defaultLocale as Language);
  const [textInput, setTextInput] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null as any);

  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    const langMap: Record<string, string> = {
      hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', kn: 'kn-IN', ml: 'ml-IN',
      mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN', or: 'or-IN', pa: 'pa-IN', as: 'as-IN',
    };
    recognition.lang = langMap[language] || 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

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

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  }, [language]);

  const stopVoiceRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
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
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: `Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)}`,
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Could not get location. Please enable location access.');
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!textInput.trim() && !voiceTranscript.trim() && !photo && !ocrText.trim()) {
      setErrorMessage('Please provide at least one input (text, voice, or photo)');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('text_input', textInput);
      formData.append('voice_transcript', voiceTranscript);
      formData.append('ocr_text', ocrText);
      formData.append('category', category);
      formData.append('language', language);
      if (photo) formData.append('photo', photo);
      if (location) {
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
        formData.append('location_name', location.name);
      }
      formData.append('session_id', crypto.randomUUID());

      const response = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitStatus('success');
      setTextInput('');
      setVoiceTranscript('');
      setPhoto(null);
      setPhotoPreview(null);
      setOcrText('');
      setLocation(null);
      
      setTimeout(() => {
        setSubmitStatus('idle');
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [photoPreview]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('category')}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{categoryLabels[cat.value] || cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>{lang.nativeLabel}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('textInput')}</label>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={4}
          placeholder={t('textPlaceholder')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('voiceInput')}</label>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200'
            }`}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isRecording ? t('stopRecording') : t('startRecording')}
          </button>
          {isRecording && <span className="text-sm text-red-600 animate-pulse">{t('listening')}</span>}
        </div>
        {voiceTranscript && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{voiceTranscript}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('photoUpload')}</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            photo ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-blue-400'); }}
          onDragLeave={(e) => { e.currentTarget.classList.remove('border-blue-400'); }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('border-blue-400');
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
            <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setPhoto(null); setPhotoPreview(null); setOcrText(''); }}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >×</button>
            </div>
          ) : (
            <>
              <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-1">{t('photoHint')}</p>
              <button
                type="button"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Choose File
              </button>
            </>
          )}
        </div>
        {ocrText && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800"><strong>OCR Text:</strong> {ocrText}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('location')}</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {t('useCurrentLocation')}
          </button>
          {location && (
            <span className="flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {location.name}
            </span>
          )}
        </div>
        {location && (
          <input
            type="hidden"
            name="latitude"
            value={location.lat}
          />
        )}
        {location && (
          <input
            type="hidden"
            name="longitude"
            value={location.lng}
          />
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{t('success')}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage || t('error')}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('submitting')}
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            {t('submit')}
          </>
        )}
      </button>
    </form>
  );
}