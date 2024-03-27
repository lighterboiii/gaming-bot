export interface ItemData {
  isCollectible?: boolean;
  item_count?: number;
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_price_coins: number;
  item_price_tokens: number;
  item_type: string;
}


export interface LavkaData {
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_type: string;
  price: string;
  nft_id: number;
  seller_id: number;
  seller_publicname: string;
  item_price_coins: number;
  item_price_tokens: number;
}

export type GoodsItem = LavkaData | ItemData;

export interface LavkaResponse {
  lavka: LavkaData[]; 
};
