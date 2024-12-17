import { IBannerData } from "./types/mainTypes";

const BANNERS_CACHE_KEY = 'cached_banners';
const BANNERS_CACHE_TIMESTAMP_KEY = 'banners_cache_timestamp';
const CACHE_LIFETIME = 1000 * 60 * 60; // 1 hour

const convertImageToBase64 = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (ctx) {
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png', 1.0));
      }
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const getCachedBanners = (): IBannerData[] | null => {
  const timestamp = localStorage.getItem(BANNERS_CACHE_TIMESTAMP_KEY);
  const cachedBanners = localStorage.getItem(BANNERS_CACHE_KEY);
  
  if (!timestamp || !cachedBanners) return null;
  
  if (Date.now() - Number(timestamp) > CACHE_LIFETIME) {
    localStorage.removeItem(BANNERS_CACHE_KEY);
    localStorage.removeItem(BANNERS_CACHE_TIMESTAMP_KEY);
    return null;
  }
  
  return JSON.parse(cachedBanners);
};

export const cacheBanners = async (banners: IBannerData[]) => {
  try {
    const bannersWithBase64 = await Promise.all(banners.map(async (banner) => ({
      ...banner,
      pic: await convertImageToBase64(banner.pic)
    })));
    
    localStorage.setItem(BANNERS_CACHE_KEY, JSON.stringify(bannersWithBase64));
    localStorage.setItem(BANNERS_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching banners:', error);
  }
}; 