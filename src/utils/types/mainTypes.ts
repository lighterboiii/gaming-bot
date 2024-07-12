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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface ITaskStep {
  h_key: string;
  img: string;
  step_id: number;
  step_order: number;
  step_type: "subscribe" | "instruction" | "link";
  target: string;
}

export interface ITask {
  desc_locale_key: string;
  prise_count: number;
  prise_item_id: number;
  steps: ITaskStep[];
  task_done: number;
  task_id: number;
  task_img: string;
  task_type: string;
  text_locale_key: string;
}

export interface IFortuneItem {
  fortune_item_count: number;
  fortune_item_id: number;
  fortune_item_name: string;
  fortune_item_pic: string;
  fortune_type: string;
}

export interface IFortuneData {
  fortune_all_items: IFortuneItem[];
  fortune_prize_info: IFortuneItem[];
}