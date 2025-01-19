import { ItemData } from "./types/shopTypes";

const SHOP_IMAGES_CACHE_KEY = 'cached_shop_images';
const CACHE_LIFETIME = 1000 * 60 * 60 * 24; // 24 hours

interface CachedImage {
  id: number;
  pic: string;
  mask: string;
  timestamp: number;
}

const convertImageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return url;
  }
};

export const getCachedShopImage = (itemId: number): CachedImage | null => {
  try {
    const cachedImagesString = localStorage.getItem(SHOP_IMAGES_CACHE_KEY);
    if (!cachedImagesString) return null;

    const cachedImages: CachedImage[] = JSON.parse(cachedImagesString);
    const cachedImage = cachedImages.find(img => img.id === itemId);

    if (!cachedImage) return null;

    if (Date.now() - cachedImage.timestamp > CACHE_LIFETIME) {
      const updatedCache = cachedImages.filter(img => img.id !== itemId);
      localStorage.setItem(SHOP_IMAGES_CACHE_KEY, JSON.stringify(updatedCache));
      return null;
    }

    return cachedImage;
  } catch (error) {
    console.error('Error getting cached image:', error);
    return null;
  }
};

export const cacheShopImage = async (item: ItemData): Promise<void> => {
  try {
    const cachedImagesString = localStorage.getItem(SHOP_IMAGES_CACHE_KEY);
    const cachedImages: CachedImage[] = cachedImagesString ? JSON.parse(cachedImagesString) : [];

    const filteredCache = cachedImages.filter(img => img.id !== item.item_id);

    const [picBase64, maskBase64] = await Promise.all([
      convertImageToBase64(item.item_pic),
      convertImageToBase64(item.item_mask)
    ]);

    filteredCache.push({
      id: item.item_id,
      pic: picBase64,
      mask: maskBase64,
      timestamp: Date.now()
    });

    localStorage.setItem(SHOP_IMAGES_CACHE_KEY, JSON.stringify(filteredCache));
  } catch (error) {
    console.error('Error caching shop image:', error);
  }
};

export const preloadShopImages = async (items: ItemData[]): Promise<void> => {
  try {
    const batchSize = 5;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(batch.map(item => cacheShopImage(item)));
    }
  } catch (error) {
    console.error('Error preloading shop images:', error);
  }
}; 