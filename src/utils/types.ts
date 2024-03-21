export interface UserInfo {
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

export interface ItemData {
  isCollectible?: boolean;
  item_count: number;
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_price_coins: number;
  item_price_tokens: number;
  item_type: string;
};

export interface Bonus {
    bonus_count: number;
    bonus_image: string;
    bonus_item_id: number;
    bonus_type: string;
    day: number;
}