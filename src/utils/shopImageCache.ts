const SHOP_IMAGE_CACHE_KEY = 'cached_shop_image';
const SHOP_IMAGE_CACHE_TIMESTAMP_KEY = 'shop_image_cache_timestamp';
const CACHE_LIFETIME = 1000 * 60 * 15;

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

export const getCachedShopImage = (): string | null => {
  const timestamp = localStorage.getItem(SHOP_IMAGE_CACHE_TIMESTAMP_KEY);
  const cachedImage = localStorage.getItem(SHOP_IMAGE_CACHE_KEY);
  
  if (!timestamp || !cachedImage) return null;
  
  if (Date.now() - Number(timestamp) > CACHE_LIFETIME) {
    localStorage.removeItem(SHOP_IMAGE_CACHE_KEY);
    localStorage.removeItem(SHOP_IMAGE_CACHE_TIMESTAMP_KEY);
    return null;
  }
  
  return cachedImage;
};

export const cacheShopImage = async (imageUrl: string) => {
  try {
    const base64Image = await convertImageToBase64(imageUrl);
    localStorage.setItem(SHOP_IMAGE_CACHE_KEY, base64Image);
    localStorage.setItem(SHOP_IMAGE_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching shop image:', error);
  }
}; 