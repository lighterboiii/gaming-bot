import { ItemData } from "./types/shopTypes";

const imageCache = new Map<string, HTMLImageElement>();
let lastDataHash = '';

const generateDataHash = (items: ItemData[]): string => {
  return items
    .map(item => `${item.item_id}:${item.item_pic}:${item.item_mask}`)
    .join('|');
};

export const shouldUpdateCache = (items: ItemData[]): boolean => {
  const newHash = generateDataHash(items);
  const shouldUpdate = newHash !== lastDataHash;
  lastDataHash = newHash;
  return shouldUpdate;
};

export const cacheCollectibles = async (items: ItemData[]) => {
  if (!shouldUpdateCache(items)) {
    return true; // Skip caching if data hasn't changed
  }

  const cachePromises = items.flatMap(item => {
    const promises = [];
    
    // Cache item_pic
    if (item.item_pic && !imageCache.has(item.item_pic)) {
      promises.push(new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCache.set(item.item_pic, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = item.item_pic;
      }));
    }

    // Cache item_mask if it exists
    if (item.item_mask && !imageCache.has(item.item_mask)) {
      promises.push(new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          imageCache.set(item.item_mask, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = item.item_mask;
      }));
    }

    return promises;
  });

  try {
    await Promise.all(cachePromises);
    return true;
  } catch (error) {
    console.error('Error caching collectible images:', error);
    return false;
  }
};

export const isImageCached = (url: string): boolean => {
  return imageCache.has(url);
};

export const clearImageCache = () => {
  imageCache.clear();
  lastDataHash = '';
}; 