'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Loader2 } from 'lucide-react';

interface CallScreenProps {
  status: 'ringing' | 'connected';
}

export function CallScreen({ status }: CallScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Phone className="w-12 h-12 text-white" />
        </div>

        <AnimatePresence>
          {status === 'ringing' && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-blue-400/40"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {status === 'connected' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900"
          >
            <div className="w-2.5 h-2.5 bg-white rounded-full" />
          </motion.div>
        )}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-white mb-2"
      >
        JanSankalp AI IVR
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-400 mb-8 text-center"
      >
        AI Powered Voice Complaint Registration
      </motion.p>

      <AnimatePresence mode="wait">
        {status === 'ringing' ? (
          <motion.div
            key="ringing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 15, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
            >
              <Phone className="w-5 h-5 text-blue-400" />
            </motion.div>
            <span className="text-blue-400 font-medium text-lg">Incoming Call...</span>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
            <span className="text-green-400 font-medium text-lg">Connected</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">Secure Line</span>
        </div>
      </div>
    </div>
  );
}
