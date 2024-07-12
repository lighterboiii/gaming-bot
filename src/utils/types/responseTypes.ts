import { IMember } from "./memberTypes";

export interface ISellLavkaRes {
  message: string;
}

export interface IBuyItemRes {
  message: string;
}

export interface ICreateRoomResponse {
  creator: number;
  message: string;
  room_id: number;
}

export interface IResultDataResponse {
  result_data: {
    refs_info: IMember[];
    total_balance: number;
  }
}

export interface ITransferCoinsToBalanceResponse {
  transfered: string;
  new_coins: number;
}

export interface IEmojiResponse {
  user_emoji_pack: {
    name: string;
    user_emoji_pack: string[];
  }
}
