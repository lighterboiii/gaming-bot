import { useState, useEffect } from 'react';

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(true);

  const handleOrientationChange = () => {
    const isPortraitMode = window.innerHeight > window.innerWidth;
    
    if (window.screen && window.screen.orientation) {
      const orientation = window.screen.orientation.type;
      if (orientation.includes('landscape')) {
        setIsPortrait(false);
      } else if (orientation.includes('portrait')) {
        setIsPortrait(true);
      } else {
        setIsPortrait(isPortraitMode);
      }
    } else {
      setIsPortrait(isPortraitMode);
    }
  };

  useEffect(() => {
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    Telegram.WebApp.onEvent('viewportChanged', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      Telegram.WebApp.offEvent('viewportChanged', handleOrientationChange);
    };
  }, []);

  return isPortrait;
};

export default useOrientation;
