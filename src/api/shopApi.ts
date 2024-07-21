import { CollectibleResponse } from "utils/types/responseTypes";
import { CombinedItemData } from "utils/types/shopTypes";

import { getReq, putReq } from "./api";
import {
  activeEmojiParamString,
  activeSkinParamString,
  addNewCollectibleParamString,
  buyLavkaUri,
  buyShopItemUri,
  cancelSellLavka,
  getInventoryUri,
  getLavkaUri,
  getShopUri,
  itemCountParamString,
  itemIdParamString,
  nftIdParamString,
  priceParamString,
  sellLavkaUri,
  setActiveEmojiUri,
  setActiveSkinUri,
  setCollectiblesUri,
} from "./requestData";

// Product
export const setActiveSkinRequest = async (itemId: number, userIdValue: number) => {
  return await putReq({
    uri: setActiveSkinUri,
    userId: userIdValue,
    endpoint: `${activeSkinParamString}${itemId}`
  });
};
export const buyItemRequest = async (itemId: number, itemCount = 1, userIdValue: number) => {
  return await putReq({
    uri: buyShopItemUri,
    userId: userIdValue,
    endpoint: `${itemIdParamString}${itemId}${itemCountParamString}${itemCount}`
  });
};
export const sellLavkaRequest = async (itemId: number, price: number, userIdValue: number) => {
  return await putReq({
    uri: sellLavkaUri,
    userId: userIdValue,
    endpoint: `${itemIdParamString}${itemId}${priceParamString}${price}`,
  });
};

export const buyLavkaRequest = async (item: CombinedItemData, userIdValue: number) => {
  return await putReq({
    uri: buyLavkaUri,
    userId: userIdValue,
    endpoint: `${nftIdParamString}${item.nft_id}`,
  });
};
export const cancelLavkaRequest = async (itemId: number, userIdValue: number) => {
  return await putReq({
    uri: cancelSellLavka,
    userId: userIdValue,
    endpoint: `${itemIdParamString}${itemId}`
  })
};
// универсальная функция для запроссов collectible
export const makeCollectibleRequest = async (itemId: number, itemCount: number, userIdValue: number) => {
  return await putReq<CollectibleResponse>({
    uri: setCollectiblesUri,
    endpoint: `${addNewCollectibleParamString}${itemId}${itemCountParamString}${itemCount}`,
    userId: userIdValue,
  });
};
// получить данные из лавки
export const getLavkaAvailableRequest = async () => {
  return await getReq({
    uri: getLavkaUri,
  })
};
// поставить активный эмодзи
export const setActiveEmojiRequest = async (userIdValue: number, activeEmoji: number) => {
  return await putReq({
    uri: setActiveEmojiUri,
    userId: userIdValue,
    endpoint: `${activeEmojiParamString}${activeEmoji}`
  })
};
// запрос товаров в магазине
export const getShopItemsRequest = async () => {
  return await getReq({
    uri: getShopUri
  })
};

export const getCollectiblesInfo = async (userIdValue: number) => {
  return await getReq({
    uri: getInventoryUri,
    userId: userIdValue,
  })
};