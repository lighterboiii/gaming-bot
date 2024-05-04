import { IMember } from "./memberTypes";

export interface IUserData {
  active_skin: number;
  all_games_played_count: number;
  coinloses: number;
  coins: number;
  coinwins: number;
  collectibles: number[];
  days_online: number;
  if_ban: number;
  lang: string;
  loses: number;
  publicname: string;
  referrer_all_coins: number;
  referrer_coins: any;
  referrer_id: string;
  room_id: string;
  tickets: number;
  tokenloses: number;
  tokens: number;
  tokenwins: number;
  user_active_emoji: string | null;
  user_energy: number
  user_energy_drinks: number;
  user_exp: number;
  user_leaderboard_count: number | null;
  username: string;
  wins: number;
  photo: string;
}

export interface IBonus {
  bonus_count: number;
  bonus_image: string;
  bonus_item_id: number;
  bonus_type: string;
  day: number;
}

export interface IUserPhoto {
  info: string;
}

export interface IReferralResponse {
  result_data: {
    refs_info: IMember[];
    total_balance: number;
  }
}

export interface IReferralCoinsTransferResponse {
  transfered: number | string;
  new_coins: number;
}

export interface ICommonIconProps {
  color?: string;
  width?: number;
  height?: number;
}

export interface IBannerData {
  banner_id: number;
  button_text: string;
  main_header: string;
  main_text: string;
  pic: string;
  pic_header: string;
  pic_text: string;
  pic_text_color: string;
}