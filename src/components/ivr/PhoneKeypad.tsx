'use client';

import { motion } from 'framer-motion';
import { playDTMF } from '@/lib/ivr-sounds';

interface PhoneKeypadProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  activeKey?: string | null;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['*', '0', '#'],
];

const KEY_LABELS: Record<string, string> = {
  '1': '',
  '2': 'ABC',
  '3': 'DEF',
  '4': 'GHI',
  '5': 'JKL',
  '6': 'MNO',
  '7': 'PQRS',
  '8': 'TUV',
  '9': 'WXYZ',
  '0': '+',
  '*': '',
  '#': '',
};

export function PhoneKeypad({ onKeyPress, disabled, activeKey }: PhoneKeypadProps) {
  const handlePress = (key: string) => {
    if (disabled) return;
    playDTMF(key);
    onKeyPress(key);
  };

  return (
    <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
      {KEYS.map((row, rowIdx) =>
        row.map((key) => {
          const isActive = activeKey === key;
          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePress(key)}
              disabled={disabled}
              className={`
                relative w-[80px] h-[80px] rounded-full flex flex-col items-center justify-center
                transition-all duration-200 select-none
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg shadow-blue-500/40 ring-2 ring-blue-400/50'
                  : 'bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-50 hover:to-gray-150 active:from-gray-200 active:to-gray-300 shadow-md shadow-gray-300/50'
                }
              `}
            >
              <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                {key}
              </span>
              {KEY_LABELS[key] && (
                <span className={`text-[8px] tracking-[3px] font-medium mt-[-2px] ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {KEY_LABELS[key]}
                </span>
              )}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })
      )}
    </div>
  );
}
