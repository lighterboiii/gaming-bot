import { useState, useEffect } from 'react';

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(true);

  const handleOrientationChange = () => {
    const width = window.visualViewport ? window.visualViewport.width : window.innerWidth;
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    setIsPortrait(height > width);
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
