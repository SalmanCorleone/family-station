import { useEffect, useState } from 'react';

/**
 * Stupid hook since vercel keeps complaining about window being undefined
 */
const useCheckWindow = () => {
  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    // Now safe to access `window`
    setHasWindow(true);
  }, []);

  return hasWindow;
};

export default useCheckWindow;
