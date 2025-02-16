const SHOP_IMAGE_CACHE_KEY = 'cached_shop_image';
const SHOP_IMAGE_CACHE_TIMESTAMP_KEY = 'shop_image_cache_timestamp';
const CACHE_LIFETIME = 1000 * 60 * 15;

const fetchImageAsBlob = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
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
    const blobUrl = await fetchImageAsBlob(imageUrl);
    localStorage.setItem(SHOP_IMAGE_CACHE_KEY, blobUrl);
    localStorage.setItem(SHOP_IMAGE_CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error caching shop image:', error);
  }
}; 