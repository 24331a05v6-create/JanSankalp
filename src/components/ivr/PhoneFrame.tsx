'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-[380px]"
      >
        <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-[3rem] p-3 shadow-2xl shadow-black/50 border border-gray-700/50">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl" />
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-[2.3rem] overflow-hidden min-h-[680px] flex flex-col relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none" />
            <div className="relative flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500 font-medium">JanSankalp AI</span>
        </div>
      </motion.div>
    </div>
  );
}
