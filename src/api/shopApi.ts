import { putReq } from "./api";
import { activeSkinValue, buyLavkaUri, buyShopItemUri, sellLavkaUri, setActiveSkinUri, userId } from "./requestData";
// Product
export const setActiveSkinRequest = async (itemId: number) => {
  return await putReq({
    uri: setActiveSkinUri,
    userId: userId,
    // userId: user?.id, 
    endpoint: `${activeSkinValue}${itemId}`
  });
};
export const buyItemRequest = async (itemId: number, itemCount: number = 1) => {
  return await putReq({
    uri: buyShopItemUri,
    userId: userId,
    // userId: user?.id,
    endpoint: `&item_id=${itemId}&count=${itemCount}`
  });
};
export const sellLavkaRequest = async (itemId: number, price: number) => {
  return await putReq({
    uri: sellLavkaUri,
    userId: userId,
    // userId: user?.id,
    endpoint: `&item_id=${itemId}&price=${price}`,
  });
};
export const buyLavkaRequest = async (item: any) => {
  return await putReq({
    uri: buyLavkaUri,
    userId: userId,
    // userId: user?.id,
    endpoint: `&nft_id=${item.id}`,
  });
}