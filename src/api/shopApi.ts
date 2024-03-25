import { LavkaData } from "../utils/types";
import { putReq } from "./api";
import { activeSkinValue, buyLavkaUri, buyShopItemUri, cancelSellLavka, sellLavkaUri, setActiveSkinUri, setCollectiblesUri } from "./requestData";
// Product
export const setActiveSkinRequest = async (itemId: number, userIdValue: string) => {
  return await putReq({
    uri: setActiveSkinUri,
    userId: userIdValue,
    // userId: user?.id, 
    endpoint: `${activeSkinValue}${itemId}`
  });
};
export const buyItemRequest = async (itemId: number, itemCount: number = 1, userIdValue: string) => {
  return await putReq({
    uri: buyShopItemUri,
    userId: userIdValue,
    // userId: user?.id,
    endpoint: `&item_id=${itemId}&count=${itemCount}`
  });
};
export const sellLavkaRequest = async (itemId: number, price: number, userIdValue: string) => {
  return await putReq({
    uri: sellLavkaUri,
    userId: userIdValue,
    // userId: user?.id,
    endpoint: `&item_id=${itemId}&price=${price}`,
  });
};
export const buyLavkaRequest = async (item: LavkaData, userIdValue: string) => {
  return await putReq({
    uri: buyLavkaUri,
    userId: userIdValue,
    // userId: user?.id,string
    endpoint: `&nft_id=${item.nft_id}`,
  });
};
export const cancelLavkaRequest = async (itemId: number, userIdValue: string) => {
  return await putReq({
    uri: cancelSellLavka,
    userId: userIdValue,
    endpoint: `&item_id=${itemId}`
    // userId: user?.id,
  })
};
// универсальная функция для запроссов collectible
export const makeCollectibleRequest = async (itemId: number, itemCount: number, userIdValue: string) => {
  return await putReq<any>({
    uri: setCollectiblesUri,
    endpoint: `&add_collectible=${itemId}&count=${itemCount}`,
    userId: userIdValue,
    // userId: user?.id
  });
};