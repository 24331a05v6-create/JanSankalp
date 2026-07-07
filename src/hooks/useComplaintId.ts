'use client';

import { useState, useCallback } from 'react';
import { getSubmissions } from '@/lib/firebase';

interface UseComplaintIdReturn {
  complaintId: string | null;
  isGenerating: boolean;
  generate: () => Promise<string>;
  error: string | null;
}

export function useComplaintId(): UseComplaintIdReturn {
  const [complaintId, setComplaintId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const year = new Date().getFullYear();
      // Count all submissions to generate next ID
      const allSubs = await getSubmissions({ limitCount: 10000 });
      const count = allSubs.length + 1;
      const id = `JS-${year}-${String(count).padStart(6, '0')}`;
      setComplaintId(id);
      return id;
    } catch {
      const fallbackId = `JS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`;
      setComplaintId(fallbackId);
      return fallbackId;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { complaintId, isGenerating, generate, error };
}
