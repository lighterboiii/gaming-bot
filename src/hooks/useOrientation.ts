import { useState, useEffect } from 'react';

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const handleOrientationChange = () => {
    const isPortraitMode = window.innerHeight > window.innerWidth;
    const orientation = window.screen && window.screen.orientation ? 
      window.screen.orientation.type : window.orientation;
    
    if (orientation === 'landscape-primary' 
      || orientation === 'landscape-secondary' 
      || orientation === 90 
      || orientation === -90) {
      setIsPortrait(false);
    } else if (isPortraitMode) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };

  useEffect(() => {
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return isPortrait;
};

export default useOrientation;
