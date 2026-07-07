'use client';

import { useCallback, useRef, useEffect, useState } from 'react';
import { playIVRAudio, stopCurrentAudio, type IVRAudioType } from '@/lib/ivr-audio';

interface UseSpeechSynthesisReturn {
  speak: (text: string, lang?: string, audioType?: IVRAudioType) => Promise<void>;
  cancel: () => void;
  isSpeaking: boolean;
  availableVoices: SpeechSynthesisVoice[];
}

const LANG_MAP: Record<string, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  or: 'or-IN',
  pa: 'pa-IN',
  as: 'as-IN',
};

function speakBrowserTTS(
  text: string,
  lang: string,
  availableVoices: SpeechSynthesisVoice[],
  shouldAbort?: () => boolean
): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      console.log('[TTS] SpeechSynthesis not available');
      resolve();
      return;
    }

    if (shouldAbort?.()) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const targetLang = LANG_MAP[lang] || lang || 'en-US';

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Try to find a matching voice
    const voice = availableVoices.find((v) => v.lang === targetLang)
      || availableVoices.find((v) => v.lang.startsWith(lang))
      || null;

    if (voice) {
      utterance.voice = voice;
      console.log(`[TTS] Using voice: ${voice.name} for ${lang}`);
    } else {
      console.log(`[TTS] No specific voice for ${lang}, using browser default with lang=${targetLang}`);
    }

    const safetyTimeout = setTimeout(() => {
      console.warn(`[TTS] Safety timeout for ${lang}`);
      resolve();
    }, 30000);

    utterance.onend = () => {
      clearTimeout(safetyTimeout);
      resolve();
    };

    utterance.onerror = (event) => {
      clearTimeout(safetyTimeout);
      // "interrupted" and "canceled" are normal when cancel() is called — not real errors
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error(`[TTS] Error for ${lang}:`, event.error);
      }
      resolve();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error(`[TTS] Failed to start for ${lang}:`, err);
      clearTimeout(safetyTimeout);
      resolve();
    }
  });
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speakingRef = useRef(false);
  const abortRef = useRef(false);
  const currentAudioRef = useRef<{ stop: () => void } | null>(null);
  const generationRef = useRef(0);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      console.log(`[TTS] Loaded ${voices.length} voices`);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      stopCurrentAudio();
    };
  }, []);

  const speak = useCallback(
    (text: string, lang: string = 'en', audioType?: IVRAudioType): Promise<void> => {
      const gen = ++generationRef.current;
      const isAborted = () => abortRef.current || gen !== generationRef.current;

      return new Promise((resolve) => {
        // If a specific audio type is requested, try pre-recorded audio first
        if (audioType) {
          console.log(`[TTS] Attempting pre-recorded audio: ${lang}/${audioType}`);
          abortRef.current = false;
          speakingRef.current = true;
          setIsSpeaking(true);
          currentAudioRef.current = playIVRAudio(
            lang,
            audioType,
            () => {
              if (isAborted()) return;
              speakingRef.current = false;
              setIsSpeaking(false);
              currentAudioRef.current = null;
              resolve();
            },
            () => {
              if (isAborted()) {
                speakingRef.current = false;
                setIsSpeaking(false);
                resolve();
                return;
              }
              console.log(`[TTS] Falling back to browser TTS for ${lang}`);
              speakBrowserTTS(text, lang, availableVoices, isAborted).then(() => {
                if (isAborted()) return;
                speakingRef.current = false;
                setIsSpeaking(false);
                resolve();
              });
            }
          );
          return;
        }

        // No specific audio type — use browser TTS directly
        abortRef.current = false;
        speakingRef.current = true;
        setIsSpeaking(true);

        speakBrowserTTS(text, lang, availableVoices, isAborted).then(() => {
          if (isAborted()) return;
          speakingRef.current = false;
          setIsSpeaking(false);
          resolve();
        });
      });
    },
    [availableVoices]
  );

  const cancel = useCallback(() => {
    generationRef.current++;
    abortRef.current = true;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.stop();
      currentAudioRef.current = null;
    }
    speakingRef.current = false;
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    cancel,
    isSpeaking,
    availableVoices,
  };
}
