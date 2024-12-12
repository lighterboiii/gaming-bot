import React, { createContext, useContext, useEffect, useState } from 'react';

interface ImagePreloadContextType {
  isLoading: boolean;
  preloadedImages: Record<string, string>;
}

const ImagePreloadContext = createContext<ImagePreloadContextType>({
  isLoading: true,
  preloadedImages: {},
});

export const useImagePreload = () => useContext(ImagePreloadContext);

export const ImagePreloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const imagesToPreload = {
      'gowinLogo': require('../images/gowin.png'),
      
      'emoji_icon': require('../images/rock-paper-scissors/emoji_icon.png'),
      'leftRock': require('../images/rock-paper-scissors/left_rock.png'),
      'rightRock': require('../images/rock-paper-scissors/right_rock.png'),
      'newVS': require('../images/rock-paper-scissors/VS_new.png'),
      'lLoseAnim': require('../images/rock-paper-scissors/winlose/l_lose.png'),
      'lWinAnim': require('../images/rock-paper-scissors/winlose/l_win.png'),
      'rLoseAnim': require('../images/rock-paper-scissors/winlose/r_lose.png'),
      'rWinAnim': require('../images/rock-paper-scissors/winlose/r_win.png'),
    };

    const loadImages = async () => {
      const loadedImages: Record<string, string> = {};
      
      const promises = Object.entries(imagesToPreload).map(([key, src]) => 
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            loadedImages[key] = src;
            resolve();
          };
          img.onerror = () => resolve();
        }));

      await Promise.all(promises);
      setPreloadedImages(loadedImages);
      setIsLoading(false);
    };

    loadImages();
  }, []);

  return (
    <ImagePreloadContext.Provider value={{ isLoading, preloadedImages }}>
      {children}
    </ImagePreloadContext.Provider>
  );
}; 