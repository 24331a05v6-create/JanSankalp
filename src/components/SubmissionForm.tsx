'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Mic, MapPin, Image, Send, Loader2, CheckCircle, AlertCircle, Square } from 'lucide-react';
import { CATEGORIES, type Category } from '@/lib/types';

const CAT_LABELS: Record<string, Record<string, string>> = {
  en: { education: 'Education', healthcare: 'Healthcare', roads: 'Roads & Transport', water: 'Water Supply', sanitation: 'Sanitation', electricity: 'Electricity', employment: 'Employment', other: 'Other' },
  hi: { education: 'शिक्षा', healthcare: 'स्वास्थ्य सेवा', roads: 'सड़कें और परिवहन', water: 'जल आपूर्ति', sanitation: 'स्वच्छता', electricity: 'बिजली', employment: 'रोजगार', other: 'अन्य' },
  ta: { education: 'கல்வி', healthcare: 'சுகாதாரம்', roads: 'சாலைகள்', water: 'தண்ணீர்', sanitation: 'சுத்தம்', electricity: 'மின்சாரம்', employment: 'வேலை', other: 'மற்றவை' },
  te: { education: 'విద్య', healthcare: 'ఆరోగ్యం', roads: 'రోడ్లు', water: 'నీరు', sanitation: 'పారిశుధ్యం', electricity: 'విద్యుత్', employment: 'ఉపాధి', other: 'ఇతర' },
  kn: { education: 'ಶಿಕ್ಷಣ', healthcare: 'ಆರೋಗ್ಯ', roads: 'ರಸ್ತೆಗಳು', water: 'ನೀರು', sanitation: 'ಸ್ವಚ್ಛತೆ', electricity: 'ವಿದ್ಯುತ್', employment: 'ಉದ್ಯೋಗ', other: 'ಇತರೆ' },
  ml: { education: 'വിദ്യാഭ്യാസം', healthcare: 'ആരോഗ്യം', roads: 'റോഡുകൾ', water: 'വെള്ളം', sanitation: 'ശുചിത്വം', electricity: 'വൈദ്യുതി', employment: 'തൊഴിൽ', other: 'മറ്റുള്ളവ' },
  mr: { education: 'शिक्षण', healthcare: 'आरोग्य', roads: 'मार्ग', water: 'पाणी', sanitation: 'स्वच्छता', electricity: 'वीज', employment: 'रोजगार', other: 'इतर' },
  gu: { education: 'શિક્ષણ', healthcare: 'આરોગ્ય', roads: 'માર્ગો', water: 'પાણી', sanitation: 'સ્વચ્છતા', electricity: 'વીજળી', employment: 'રોજગાર', other: 'અન્ય' },
  bn: { education: 'শিক্ষা', healthcare: 'স্বাস্থ্য', roads: 'সড়ক', water: 'পানি', sanitation: 'স্বাস্থ্যব্যবস্থা', electricity: 'বিদ্যুৎ', employment: 'কর্মসংস্থান', other: 'অন্যান্য' },
  or: { education: 'ଶିକ୍ଷା', healthcare: 'ସ୍ୱାସ୍ଥ୍ୟ', roads: 'ରାସ୍ତା', water: 'ପାଣି', sanitation: 'ସ୍ୱଚ୍ଛତା', electricity: 'ବିଦ୍ୟୁତ୍', employment: 'ରୋଜଗାର', other: 'ଅନ୍ୟ' },
  pa: { education: 'ਸਿੱਖਿਆ', healthcare: 'ਸਿਹਤ', roads: 'ਸੜ੍ਹਕ', water: 'ਪਾਣੀ', sanitation: 'ਸਫ਼ਾਈ', electricity: 'ਬਿਜਲੀ', employment: 'ਰੁਜ਼ਗਾਰ', other: 'ਹੋਰ' },
  as: { education: 'শিক্ষা', healthcare: 'স্বাস্থ্য', roads: 'ৰাস্তা', water: 'পানী', sanitation: 'পৰিশ্ৰৰতা', electricity: 'বিদ্যুৎ', employment: 'কৰ্মসংস্থান', other: 'আন' },
};

const UI_TEXT: Record<string, { record: string; stop: string; listening: string; hint: string; photo: string; photoHint: string; location: string; submit: string; submitting: string; success: string; clear: string }> = {
  en: { record: 'Start Recording', stop: 'Stop', listening: 'Listening...', hint: 'Tap and speak your request', photo: 'Upload Photo (optional)', photoHint: 'Photo of the issue', location: 'Use Current Location', submit: 'Submit Request', submitting: 'Submitting...', success: 'Request submitted!', clear: 'Clear' },
  hi: { record: 'रिकॉर्डिंग शुरू करें', stop: 'बंद करें', listening: 'सुन रहा है...', hint: 'बटन दबाएं और बोलें', photo: 'फोटो अपलोड करें', photoHint: 'समस्या की फोटो', location: 'स्थान लें', submit: 'अनुरोध सबमिट करें', submitting: 'सबमिट हो रहा है...', success: 'अनुरोध सबमिट हो गया!', clear: 'साफ करें' },
  ta: { record: 'பதிவு தொடங்கு', stop: 'நிறுத்து', listening: 'கேட்கிறது...', hint: 'பொத்தானை அழுத்தி பேசுங்கள்', photo: 'புகைப்படம்', photoHint: 'பிரச்சினையின் புகைப்படம்', location: 'இடம்', submit: 'சமர்ப்பிக்கவும்', submitting: 'சமர்ப்பிக்கிறது...', success: 'சமர்ப்பிக்கப்பட்டது!', clear: 'நீக்கு' },
  te: { record: 'రికార్డింగ్ ప్రారంభించు', stop: 'ఆపు', listening: 'వింటోంది...', hint: 'బటన్ నొక్కి మాట్లాడండి', photo: 'ఫోటో', photoHint: 'సమస్య యొక్క ఫోటో', location: 'స్థానం', submit: 'సమర్పించు', submitting: 'సమర్పిస్తోంది...', success: 'సమర్పించబడింది!', clear: 'తొలగించు' },
  kn: { record: 'ರಿಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭಿಸಿ', stop: 'ನಿಲ್ಲಿಸಿ', listening: 'ಕೇಳುತ್ತಿದೆ...', hint: 'ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ', photo: 'ಫೋಟೋ', photoHint: 'ಸಮಸ್ಯೆಯ ಫೋಟೋ', location: 'ಸ್ಥಳ', submit: 'ಸಮರ್ಪಿಸಿ', submitting: 'ಸಮರ್ಪಿಸುತ್ತಿದೆ...', success: 'ಸಮರ್ಪಿಸಲಾಗಿದೆ!', clear: 'ತೆರವುಗೊಳಿಸಿ' },
  ml: { record: 'റെക്കോർഡിംഗ് ആരംഭിക്കുക', stop: 'നിർത്തുക', listening: 'കേൾക്കുന്നു...', hint: 'ബട്ടൺ അമർത്തി സംസാരിക്കുക', photo: 'ഫോട്ടോ', photoHint: 'പ്രശ്നത്തിന്റെ ഫോട്ടോ', location: 'സ്ഥലം', submit: 'സമർപ്പിക്കുക', submitting: 'സമർപ്പിക്കുന്നു...', success: 'സമർപ്പിച്ചു!', clear: 'മായ്ക്കുക' },
  mr: { record: 'रिकॉर्डिंग सुरू करा', stop: 'थांबवा', listening: 'ऐकत आहे...', hint: 'बटण दाबा आणि बोला', photo: 'फोटो', photoHint: 'समस्येचा फोटो', location: 'स्थान', submit: 'सबमिट करा', submitting: 'सबमिट होत आहे...', success: 'सबमिट झाले!', clear: 'साफ करा' },
  gu: { record: 'રેકોર્ડિંગ શરૂ કરો', stop: 'બંધ કરો', listening: 'સાંભળી રહ્યા છે...', hint: 'બટન દબાવો અને બોલો', photo: 'ફોટો', photoHint: 'સમસ્યાનો ફોટો', location: 'સ્થાન', submit: 'સબમિટ કરો', submitting: 'સબમિટ થઈ રહ્યું છે...', success: 'સબમિટ થયું!', clear: 'સાફ કરો' },
  bn: { record: 'রেকর্ডিং শুরু করুন', stop: 'থামুন', listening: 'শুনছে...', hint: 'বোতাম চাপুন এবং কথা বলুন', photo: 'ছবি', photoHint: 'সমস্যার ছবি', location: 'অবস্থান', submit: 'জমা দিন', submitting: 'জমা হচ্ছে...', success: 'জমা হয়েছে!', clear: 'পরিষ্কার' },
  or: { record: 'ରେକର୍ଡିଂ ଆରମ୍ଭ କରନ୍ତୁ', stop: 'ବନ୍ଦ କରନ୍ତୁ', listening: 'ଶୁଣୁଛି...', hint: 'ବଟନ୍ ଦବାନ୍ତୁ ଏବଂ କୁହନ୍ତୁ', photo: 'ଫଟୋ', photoHint: 'ସମସ୍ୟାର ଫଟୋ', location: 'ସ୍ଥାନ', submit: 'ଦାଖଲ କରନ୍ତୁ', submitting: 'ଦାଖଲ ହେଉଛି...', success: 'ଦାଖଲ ହୋଇଛି!', clear: 'ସଫା କରନ୍ତୁ' },
  pa: { record: 'ਰਿਕਾਰਡਿੰਗ ਸ਼ੁਰੂ ਕਰੋ', stop: 'ਬੰਦ ਕਰੋ', listening: 'ਸੁਣ ਰਿਹਾ ਹੈ...', hint: 'ਬਟਨ ਦਬਾਓ ਅਤੇ ਬੋਲੋ', photo: 'ਫੋਟੋ', photoHint: 'ਸਮੱਸਿਆ ਦੀ ਫੋਟੋ', location: 'ਥਾਂ', submit: 'ਜਮ੍ਹਾ ਕਰੋ', submitting: 'ਜਮ੍ਹਾ ਹੋ ਰਿਹਾ ਹੈ...', success: 'ਜਮ੍ਹਾ ਹੋ ਗਿਆ!', clear: 'ਸਾਫ਼ ਕਰੋ' },
  as: { record: 'ৰেকৰ্ডিং আৰম্ভ কৰক', stop: 'বন্ধ কৰক', listening: 'শুনিছে...', hint: 'বুটাম টিপক কথা কওক', photo: 'ফটো', photoHint: 'সমস্যাৰ ফটো', location: 'স্থান', submit: 'দাখিল কৰক', submitting: 'দাখিল হৈ আছে...', success: 'দাখিল হৈছে!', clear: 'পৰিষ্কাৰ' },
};

export function SubmissionForm() {
  const locale = useLocale();
  const router = useRouter();

  const [category, setCategory] = useState<Category>('other');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detectedLang, setDetectedLang] = useState('en');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);

  const recognitionRef = useRef(null as any);
  const timerRef = useRef<any>(null);

  const ui = UI_TEXT[locale] || UI_TEXT.en;
  const cats = CAT_LABELS[locale] || CAT_LABELS.en;

  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 3;

    let finalTranscript = voiceTranscript ? voiceTranscript + ' ' : '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text + ' ';
          const resultLang = result[0].lang || result.lang || '';
          if (resultLang) {
            const langCode = resultLang.split('-')[0];
            const langMap: Record<string, string> = {
              en: 'en', hi: 'hi', ta: 'ta', te: 'te', kn: 'kn',
              ml: 'ml', mr: 'mr', gu: 'gu', bn: 'bn', or: 'or',
              pa: 'pa', as: 'as',
            };
            if (langMap[langCode]) setDetectedLang(langCode);
          }
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
    timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
  }, [locale, voiceTranscript]);

  const stopVoiceRecording = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);

    const rawText = voiceTranscript.trim();
    if (rawText) {
      try {
        const res = await fetch('/api/detect-language', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rawText }),
        });
        const data = await res.json();
        if (data.text) setVoiceTranscript(data.text);
        if (data.language) setDetectedLang(data.language);
      } catch {
        setDetectedLang(locale);
      }
    }
  }, [voiceTranscript, locale]);

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
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}` }),
      () => alert('Could not get location')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceTranscript.trim() && !photo && !ocrText.trim()) {
      setErrorMessage(locale === 'hi' ? 'कृपया आवाज़ रिकॉर्ड करें या फोटो अपलोड करें' : 'Please record your voice or upload a photo');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const payload: Record<string, any> = {
        text_input: voiceTranscript,
        voice_transcript: voiceTranscript,
        ocr_text: ocrText,
        category,
        language: detectedLang || locale,
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
      if (!response.ok) throw new Error(result.error || 'Failed');

      setSubmitStatus('success');
      setVoiceTranscript('');
      setPhoto(null);
      setPhotoPreview(null);
      setOcrText('');
      setLocation(null);
      setTimeout(() => { setSubmitStatus('idle'); router.refresh(); }, 3000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error?.message || 'Failed');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="input w-full px-4 py-3 rounded-xl text-base"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>{cats[cat.value] || cat.label}</option>
        ))}
      </select>

      {/* BIG Voice Button */}
      <div className="flex flex-col items-center py-4">
        <button
          type="button"
          onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
          disabled={isSubmitting}
          className={`relative w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
            isRecording
              ? 'bg-red-500 text-white scale-110 shadow-red-300'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-blue-300'
          }`}
        >
          {isRecording ? (
            <>
              <Square className="w-10 h-10 mb-2" fill="currentColor" />
              <span className="text-base font-semibold">{ui.stop}</span>
              <span className="text-sm mt-1 opacity-80">{formatTime(recordingTime)}</span>
            </>
          ) : (
            <>
              <Mic className="w-14 h-14 mb-2" />
              <span className="text-base font-semibold">{ui.record}</span>
            </>
          )}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2 mt-4">
            <div className="flex gap-1 items-end h-6">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-red-500 rounded-full animate-pulse"
                  style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-red-600 font-medium">{ui.listening}</span>
          </div>
        )}

        {!isRecording && !voiceTranscript && (
          <p className="text-sm mt-3" style={{ color: 'var(--text-tertiary)' }}>{ui.hint}</p>
        )}
      </div>

      {/* Transcript */}
      {voiceTranscript && (
        <div className="p-4 rounded-xl" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{voiceTranscript}</p>
          <button type="button" onClick={() => setVoiceTranscript('')} className="text-xs text-red-500 hover:text-red-700 mt-2">{ui.clear}</button>
        </div>
      )}

      {/* Photo */}
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{ui.photo}</label>
        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors`}
          style={{
            borderColor: photo ? '#10b981' : 'var(--border-primary)',
            background: photo ? 'rgba(16,185,129,0.05)' : 'var(--bg-tertiary)',
          }}
          onClick={() => !photo && document.getElementById('photo-upload')?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]?.type.startsWith('image/')) handlePhotoUpload(e.dataTransfer.files[0]); }}
        >
          <input type="file" accept="image/*" className="hidden" id="photo-upload" onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])} />
          {photoPreview ? (
            <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              <button type="button" onClick={(e) => { e.stopPropagation(); setPhoto(null); setPhotoPreview(null); setOcrText(''); }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
            </div>
          ) : (
            <>
              <Image className="w-8 h-8 mx-auto mb-1" style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{ui.photoHint}</p>
            </>
          )}
        </div>
        {ocrText && (
          <div className="mt-2 p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-xs" style={{ color: '#3b82f6' }}><strong>OCR:</strong> {ocrText}</p>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="flex items-center gap-2">
        <button type="button" onClick={getCurrentLocation}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
          <MapPin className="w-4 h-4" />{ui.location}
        </button>
        {location && (
          <span className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
            <MapPin className="w-3.5 h-3.5" />{location.name}
          </span>
        )}
      </div>

      {/* Status */}
      {submitStatus === 'success' && (
        <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">{ui.success}</span>
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="flex items-center gap-2 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">{errorMessage}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || (!voiceTranscript && !photo)}
        className="w-full py-4 px-6 font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
        style={{ background: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.3)' }}
      >
        {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" />{ui.submitting}</> : <><Send className="w-5 h-5" />{ui.submit}</>}
      </button>
    </form>
  );
}