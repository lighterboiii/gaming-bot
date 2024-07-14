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

export interface IClaimRewardResponse {
  message: string;
  new_value: number;
}

export interface IGetPrizeResponse {
  message: string;
  item_id: number;
}

export interface ISpinWheelResponse {
  message: string;
  tokens: string;
}

export interface CollectibleResponse {
  message: number;
}

export interface ILeaderResponse {
  avatar: string;
  coins: number;
  item_mask: string;
  item_pic: string;
  public_name: string;
  user_id: number;
}

export interface ITopUsersRes {
  days: number;
  hours: number;
  minutes: number;
  top_old_winner_photo_url: string;
  top_old_winner_username: string;
  top_prize_count: string;
  top_prize_photo_url: string;
  top_type: string;
  top_users: ILeaderResponse[];
}
