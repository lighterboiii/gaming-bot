import { useState, useEffect } from 'react';

const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const handleOrientationChange = () => {
    if (window.innerHeight > window.innerWidth) {
      setIsPortrait(true);
    } else {
      setIsPortrait(false);
    }
  };

  useEffect(() => {
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return isPortrait;
};

export default useOrientation;
