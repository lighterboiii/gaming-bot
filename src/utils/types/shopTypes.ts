/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ItemData {
  isCollectible?: boolean;
  item_count?: number;
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_price_coins: number;
  item_price_tokens: number;
  item_type: string;
  item_max?: number;
}

export interface LavkaResponse {
  lavka: ItemData[];
}

export interface CombinedItemData extends ItemData {
  isCollectible?: any;
  seller_id?: any;
  seller_publicname?: string;
  nft_id?: number;
}
