import { useCallback, useEffect, useRef, useState } from 'react';
import useInterval from './useInterval';

const useAutoSave = (callback: () => Promise<void>, autoSaveInterval: number) => {
  const [countdown, setCountdown] = useState(0);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useInterval(
    () => {
      setCountdown((t) => t - 1);
    },
    countdown > 0 ? 1000 : null,
  );

  const trigger = useCallback(() => {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    setCountdown(autoSaveInterval);
    timeOutRef.current = setTimeout(async () => {
      // make api call
      setSaving(true);
      await callbackRef.current();
      setSaving(false);
      setCountdown(0);
    }, autoSaveInterval * 1000);
  }, [autoSaveInterval]);

  return {
    trigger,
    saving,
    countdown,
  };
};

export default useAutoSave;
