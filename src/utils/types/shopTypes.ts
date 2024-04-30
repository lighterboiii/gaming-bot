export interface ItemData {
  isCollectible?: boolean;
  item_count?: number;
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_price_coins: number;
  item_price_tokens: number;
  item_type: string;
  item_max: number;
}

export interface ILavkaData {
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_type: string;
  nft_id?: number;
  seller_id?: number;
  seller_publicname?: string;
  item_price_coins: number;
  item_price_tokens: number;
}

export type GoodsItem = ILavkaData | ItemData;

export interface LavkaResponse {
  lavka: ILavkaData[]; 
};

export interface CombinedItemData extends ItemData, ILavkaData {};
