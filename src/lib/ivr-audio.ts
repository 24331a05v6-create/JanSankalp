'use client';

type IVRAudioType = 'welcome' | 'problem' | 'location' | 'details' | 'thankyou' | 'confirm' | 'error' | 'language_prompt';

const AUDIO_PATHS: Record<string, Record<IVRAudioType, string>> = {
  en: {
    welcome: '/audio/ivr/en/welcome.mp3',
    problem: '/audio/ivr/en/problem.mp3',
    location: '/audio/ivr/en/location.mp3',
    details: '/audio/ivr/en/details.mp3',
    thankyou: '/audio/ivr/en/thankyou.mp3',
    confirm: '/audio/ivr/en/confirm.mp3',
    error: '/audio/ivr/en/error.mp3',
    language_prompt: '/audio/ivr/en/language_prompt.mp3',
  },
  hi: {
    welcome: '/audio/ivr/hi/welcome.mp3',
    problem: '/audio/ivr/hi/problem.mp3',
    location: '/audio/ivr/hi/location.mp3',
    details: '/audio/ivr/hi/details.mp3',
    thankyou: '/audio/ivr/hi/thankyou.mp3',
    confirm: '/audio/ivr/hi/confirm.mp3',
    error: '/audio/ivr/hi/error.mp3',
    language_prompt: '/audio/ivr/hi/language_prompt.mp3',
  },
  te: {
    welcome: '/audio/ivr/te/welcome.mp3',
    problem: '/audio/ivr/te/problem.mp3',
    location: '/audio/ivr/te/location.mp3',
    details: '/audio/ivr/te/details.mp3',
    thankyou: '/audio/ivr/te/thankyou.mp3',
    confirm: '/audio/ivr/te/confirm.mp3',
    error: '/audio/ivr/te/error.mp3',
    language_prompt: '/audio/ivr/te/language_prompt.mp3',
  },
  ta: {
    welcome: '/audio/ivr/ta/welcome.mp3',
    problem: '/audio/ivr/ta/problem.mp3',
    location: '/audio/ivr/ta/location.mp3',
    details: '/audio/ivr/ta/details.mp3',
    thankyou: '/audio/ivr/ta/thankyou.mp3',
    confirm: '/audio/ivr/ta/confirm.mp3',
    error: '/audio/ivr/ta/error.mp3',
    language_prompt: '/audio/ivr/ta/language_prompt.mp3',
  },
  kn: {
    welcome: '/audio/ivr/kn/welcome.mp3',
    problem: '/audio/ivr/kn/problem.mp3',
    location: '/audio/ivr/kn/location.mp3',
    details: '/audio/ivr/kn/details.mp3',
    thankyou: '/audio/ivr/kn/thankyou.mp3',
    confirm: '/audio/ivr/kn/confirm.mp3',
    error: '/audio/ivr/kn/error.mp3',
    language_prompt: '/audio/ivr/kn/language_prompt.mp3',
  },
  ml: {
    welcome: '/audio/ivr/ml/welcome.mp3',
    problem: '/audio/ivr/ml/problem.mp3',
    location: '/audio/ivr/ml/location.mp3',
    details: '/audio/ivr/ml/details.mp3',
    thankyou: '/audio/ivr/ml/thankyou.mp3',
    confirm: '/audio/ivr/ml/confirm.mp3',
    error: '/audio/ivr/ml/error.mp3',
    language_prompt: '/audio/ivr/ml/language_prompt.mp3',
  },
};

let audioCache: HTMLAudioElement | null = null;
let currentAudioType: string | null = null;

export function getAudioUrl(lang: string, type: IVRAudioType): string | null {
  const langPaths = AUDIO_PATHS[lang];
  if (!langPaths) return null;
  return langPaths[type] || null;
}

export function playIVRAudio(
  lang: string,
  type: IVRAudioType,
  onEnd?: () => void,
  onError?: () => void
): { stop: () => void } {
  const audioUrl = getAudioUrl(lang, type);

  if (!audioUrl) {
    console.log(`[IVR Audio] No audio file for ${lang}/${type}`);
    onError?.();
    return { stop: () => {} };
  }

  // Stop any currently playing audio
  stopCurrentAudio();

  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = audioUrl;
  audioCache = audio;
  currentAudioType = `${lang}/${type}`;

  audio.onended = () => {
    console.log(`[IVR Audio] Playback ended: ${lang}/${type}`);
    audioCache = null;
    currentAudioType = null;
    onEnd?.();
  };

  audio.onerror = (e) => {
    console.warn(`[IVR Audio] Failed to load ${audioUrl}:`, e);
    audioCache = null;
    currentAudioType = null;
    onError?.();
  };

  audio.play().catch((err) => {
    console.warn(`[IVR Audio] Play failed for ${audioUrl}:`, err);
    audioCache = null;
    currentAudioType = null;
    onError?.();
  });

  return {
    stop: () => {
      audio.pause();
      audio.currentTime = 0;
      audioCache = null;
      currentAudioType = null;
    },
  };
}

export function stopCurrentAudio(): void {
  if (audioCache) {
    audioCache.pause();
    audioCache.currentTime = 0;
    audioCache = null;
    currentAudioType = null;
  }
}

export type { IVRAudioType };
