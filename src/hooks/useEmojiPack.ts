/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getActiveEmojiPack } from '../api/mainApi';
import { setEmojiPack } from '../services/appSlice';
import { RootState } from '../services/store';

interface EmojiPackResponse {
  user_emoji_pack: {
    name: string;
    user_emoji_pack: string[];
  }
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useEmojiPack = (userId: number) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const cachedPack = useSelector((state: RootState) => state.app.emojiPack);
  const activeEmoji = useSelector((state: RootState) => state.app.info?.user_active_emoji);

  useEffect(() => {
    const fetchEmojiPack = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Всегда получаем свежие данные при смене активного эмодзи
        const response = await getActiveEmojiPack(userId) as EmojiPackResponse;
        dispatch(setEmojiPack({
          name: response.user_emoji_pack.name,
          emojis: response.user_emoji_pack.user_emoji_pack
        }));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch emoji pack'));
      } finally {
        setIsLoading(false);
      }
    };

    if (!cachedPack || 
        Date.now() - cachedPack.lastUpdated > CACHE_DURATION || 
        activeEmoji) {
      fetchEmojiPack();
    }
  }, [userId, dispatch, activeEmoji]);

  return {
    emojiPack: cachedPack,
    isLoading,
    error
  };
}; 