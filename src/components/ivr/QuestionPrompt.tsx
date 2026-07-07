'use client';

import { motion } from 'framer-motion';
import type { IVRQuestionType, IVRLanguage } from '@/lib/types';

interface QuestionPromptProps {
  questionType: IVRQuestionType;
  language: IVRLanguage;
  isSpeaking: boolean;
}

const QUESTION_STYLES: Record<IVRQuestionType, { gradient: string; borderColor: string }> = {
  problem: { gradient: 'from-red-500/20 to-orange-500/20', borderColor: 'border-red-500/20' },
  location: { gradient: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/20' },
  category: { gradient: 'from-purple-500/20 to-pink-500/20', borderColor: 'border-purple-500/20' },
};

const QUESTIONS: Record<IVRQuestionType, Record<IVRLanguage, string>> = {
  problem: {
    en: 'What is the problem you are facing?',
    hi: 'आप किस समस्या का सामना कर रहे हैं?',
    te: 'మీరు ఎదుర్కొంటున్న సమస్య ఏమిటి?',
    ta: 'நீங்கள் சந்திக்கும் பிரச்சனை என்ன?',
    kn: 'ನೀವು ಎದುರಿಸುತ್ತಿರುವ ಸಮಸ್ಯೆ ಯಾವುದು?',
    ml: 'നിങ്ങൾ നേരിടുന്ന പ്രശ്നം എന്താണ്?',
  },
  location: {
    en: 'Where is the problem located? Please tell the area or landmark.',
    hi: 'समस्या कहाँ है? कृपया क्षेत्र या लैंडमार्क बताएं।',
    te: 'సమస్య ఎక్కడ ఉంది? దయచేసి ప్రాంతం లేదా ల్యాండ్‌మార్క్ చెప్పండి.',
    ta: 'பிரச்சனை எங்கே உள்ளது? தயவுசெய்து பகுதி அல்லது அடையாளம் சொல்லுங்கள்.',
    kn: 'ಸಮಸ್ಯೆ ಎಲ್ಲಿದೆ? ದಯವಿಟ್ಟು ಪ್ರದೇಶ ಅಥವಾ ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್ ಹೇಳಿ.',
    ml: 'പ്രശ്നം എവിടെയാണ്? ദയവായി ഏരിയ അല്ലെങ്കിൽ ലാൻഡ്‌മാർക്ക് പറയുക.',
  },
  category: {
    en: 'Select your complaint category.',
    hi: 'अपनी शिकायत की श्रेणी चुनें।',
    te: 'మీ ఫిర్యాదు వర్గాన్ని ఎంచుకోండి.',
    ta: 'உங்கள் புகார் வகையைத் தேர்ந்தெடுக்கவும்.',
    kn: 'ನಿಮ್ಮ ದೂರು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    ml: 'നിങ്ങളുടെ പരാതി വിഭാഗം തിരഞ്ഞെടുക്കുക.',
  },
};

const QUESTION_ICONS: Record<IVRQuestionType, string> = {
  problem: '🔍',
  location: '📍',
  category: '📋',
};

export function QuestionPrompt({ questionType, language, isSpeaking }: QuestionPromptProps) {
  const config = QUESTION_STYLES[questionType];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-6"
      >
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center border ${config.borderColor}`}>
          <span className="text-3xl">{QUESTION_ICONS[questionType]}</span>
        </div>
        {isSpeaking && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 rounded-full border ${config.borderColor}`}
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeOut',
                }}
                style={{
                  width: '80px',
                  height: '80px',
                  top: '50%',
                  left: '50%',
                  marginTop: '-40px',
                  marginLeft: '-40px',
                }}
              />
            ))}
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {questionType === 'problem' ? 'Question 1 of 2' : 'Question 2 of 2'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-3">
          {QUESTIONS[questionType][language]}
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-3"
      >
        {isSpeaking ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-400 rounded-full"
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <span className="text-blue-400 text-sm font-medium">Speaking...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-yellow-400 rounded-full"
            />
            <span className="text-yellow-400 text-sm font-medium">Get ready to record...</span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 w-full max-w-xs"
      >
        <div className="flex justify-center gap-2">
          {['problem', 'location'].map((q, idx) => (
            <div
              key={q}
              className={`w-8 h-1.5 rounded-full ${
                q === questionType
                  ? 'bg-blue-500'
                  : idx < ['problem', 'location'].indexOf(questionType)
                  ? 'bg-green-500'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
