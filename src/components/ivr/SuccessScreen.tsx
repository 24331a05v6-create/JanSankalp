'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Home, Search } from 'lucide-react';

interface SuccessScreenProps {
  complaintId: string;
  onReturnHome: () => void;
  onTrackComplaint: () => void;
}

export function SuccessScreen({ complaintId, onReturnHome, onTrackComplaint }: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
          <motion.div
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
          </motion.div>
        </div>

        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-green-400/30"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5 + 0.5,
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-xl font-bold text-white mb-2 text-center"
      >
        Complaint Registered Successfully
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-sm text-gray-400 text-center mb-6"
      >
        Your complaint has been submitted for AI processing
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5 w-full max-w-xs mb-8"
      >
        <p className="text-xs text-gray-500 text-center mb-2">Complaint ID</p>
        <p className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-mono">
          {complaintId}
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs text-green-400">Submitted</span>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReturnHome}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all"
        >
          <Home className="w-5 h-5" />
          Return Home
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTrackComplaint}
          className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-300 font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Search className="w-5 h-5" />
          Track Complaint
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-6 flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-gray-500">Secure Connection</span>
      </motion.div>
    </div>
  );
}
