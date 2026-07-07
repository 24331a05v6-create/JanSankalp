'use client';

import { motion } from 'framer-motion';
import type { Category } from '@/lib/types';

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
  language: string;
  isSpeaking: boolean;
}

const IVR_CATEGORIES: { value: Category; label: string; key: string; icon: string }[] = [
  { value: 'healthcare', label: 'Health', key: '1', icon: '🏥' },
  { value: 'education', label: 'Education', key: '2', icon: '🎓' },
  { value: 'roads', label: 'Roads & Transport', key: '3', icon: '🛣️' },
  { value: 'water', label: 'Water Supply', key: '4', icon: '💧' },
  { value: 'sanitation', label: 'Sanitation', key: '5', icon: '🧹' },
  { value: 'electricity', label: 'Electricity', key: '6', icon: '⚡' },
  { value: 'employment', label: 'Employment', key: '7', icon: '💼' },
  { value: 'other', label: 'Other', key: '8', icon: '📋' },
];

const CATEGORY_VOICE_TEXT: Record<string, string> = {
  en: 'Select your complaint category. Press 1 for Health. Press 2 for Education. Press 3 for Roads. Press 4 for Water. Press 5 for Sanitation. Press 6 for Electricity. Press 7 for Employment. Press 8 for Other.',
  hi: 'अपनी शिकायत की श्रेणी चुनें। स्वास्थ्य के लिए 1 दबाएं। शिक्षा के लिए 2 दबाएं। सड़क के लिए 3 दबाएं। पानी के लिए 4 दबाएं। स्वच्छता के लिए 5 दबाएं। बिजली के लिए 6 दबाएं। रोजगार के लिए 7 दबाएं। अन्य के लिए 8 दबाएं।',
  te: 'మీ ఫిర్యాదు వర్గాన్ని ఎంచుకోండి. ఆరోగ్యం కోసం 1 నొక్కండి. విద్య కోసం 2 నొక్కండి. రోడ్ల కోసం 3 నొక్కండి. నీటి కోసం 4 నొక్కండి. పారిశుధ్యం కోసం 5 నొక్కండి. విద్యుత్ కోసం 6 నొక్కండి. ఉపాధి కోసం 7 నొక్కండి. ఇతర కోసం 8 నొక్కండి.',
  ta: 'உங்கள் புகார் வகையைத் தேர்ந்தெடுக்கவும். சுகாதாரத்திற்கு 1 அழுத்தவும். கல்விக்கு 2 அழுத்தவும். சாலைகளுக்கு 3 அழுத்தவும். தண்ணீருக்கு 4 அழுத்தவும். சுகாதாரத்திற்கு 5 அழுத்தவும். மின்சாரத்திற்கு 6 அழுத்தவும். வேலைவாய்ப்புக்கு 7 அழுத்தவும். மற்றவைகளுக்கு 8 அழுத்தவும்.',
  kn: 'ನಿಮ್ಮ ದೂರು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಆರೋಗ್ಯಕ್ಕಾಗಿ 1 ಒತ್ತಿ. ಶಿಕ್ಷಣಕ್ಕಾಗಿ 2 ಒತ್ತಿ. ರಸ್ತೆಗಳಿಗಾಗಿ 3 ಒತ್ತಿ. ನೀರಿಗಾಗಿ 4 ಒತ್ತಿ. ಸ್ವಚ್ಛತೆಗಾಗಿ 5 ಒತ್ತಿ. ವಿದ್ಯುತ್ತಿಗಾಗಿ 6 ಒತ್ತಿ. ಉದ್ಯೋಗಕ್ಕಾಗಿ 7 ಒತ್ತಿ. ಇತರೆಗಾಗಿ 8 ಒತ್ತಿ.',
  ml: 'നിങ്ങളുടെ പരാതി വിഭാഗം തിരഞ്ഞെടുക്കുക. ആരോഗ്യത്തിന് 1 അമർത്തുക. വിദ്യാഭ്യാസത്തിന് 2 അമർത്തുക. റോഡുകൾക്ക് 3 അമർത്തുക. വെള്ളത്തിന് 4 അമർത്തുക. ശുചിത്വത്തിന് 5 അമർത്തുക. വൈദ്യുതിക്ക് 6 അമർത്തുക. തൊഴിലിന് 7 അമർത്തുക. മറ്റുള്ളവയ്ക്ക് 8 അമർത്തുക.',
};

export function CategorySelector({ onSelect, language, isSpeaking }: CategorySelectorProps) {
  const handleKeyClick = (key: string) => {
    const cat = IVR_CATEGORIES.find((c) => c.key === key);
    if (cat) onSelect(cat.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const key = e.key;
    if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(key)) {
      handleKeyClick(key);
    }
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-8"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      autoFocus
    >
      {/* Speaking indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        {isSpeaking ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-400 rounded-full"
                  animate={{ height: [4, 14, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
            <span className="text-blue-400 text-xs font-medium">Listen & press a key...</span>
          </div>
        ) : (
          <span className="text-yellow-400 text-xs font-medium">Press a number key (1-8)</span>
        )}
      </motion.div>

      {/* Category grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {IVR_CATEGORIES.map((cat, index) => (
          <motion.button
            key={cat.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 200 }}
            onClick={() => handleKeyClick(cat.key)}
            className="relative flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-blue-500/40 active:scale-95 transition-all text-left group"
          >
            {/* Keypad number */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all">
              <span className="text-sm font-bold text-blue-300 group-hover:text-blue-200">{cat.key}</span>
            </div>
            <div className="min-w-0">
              <span className="text-sm font-medium text-gray-200 block truncate">{cat.label}</span>
              <span className="text-lg">{cat.icon}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <span className="text-xs text-gray-500">Select category to continue</span>
      </motion.div>
    </div>
  );
}

export { IVR_CATEGORIES, CATEGORY_VOICE_TEXT };
