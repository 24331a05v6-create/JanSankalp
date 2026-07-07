'use client';

import { motion } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';

export function ProcessingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-purple-500/20">
          <Brain className="w-14 h-14 text-purple-400" />
        </div>

        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-purple-400/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: 'easeOut',
            }}
            style={{
              width: '112px',
              height: '112px',
              top: '50%',
              left: '50%',
              marginTop: '-56px',
              marginLeft: '-56px',
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-bold text-white mb-3 text-center"
      >
        AI is processing your complaint
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-400 text-center mb-8 max-w-xs"
      >
        Analyzing audio, extracting key details, and categorizing your issue...
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-2"
      >
        <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
        <span className="text-purple-400 text-sm font-medium">Processing</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8 w-full max-w-xs"
      >
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Analyzing audio</span>
          <span className="text-green-400">Done</span>
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Extracting details</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-green-400"
          >
            Done
          </motion.span>
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 2, ease: 'easeInOut' }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Categorizing</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            className="text-green-400"
          >
            Done
          </motion.span>
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, delay: 4, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
