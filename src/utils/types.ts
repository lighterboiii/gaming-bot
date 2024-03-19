export interface UserData {
  info: {
    lang: string;
    user_id: number;
    username: string;
    active_skin: number;
    all_games_played_count: number;
    coinloses: number;
    coins: number;
    coinwins: number;
    collectibles: number[];
    days_online: number;
    if_ban: number;
    loses: number;
    publicname: string;
    referrer_all_coins: number;
    referrer_coins: number;
    referrer_id: number;
    tickets: number;
    tokenloses: number;
    tokens: number;
    tokenwins: number;
    wins: number;
    photo: string;
  },
  bonus: string;
};

export interface ItemData {
  isCollectible?: boolean;
  item_count: number;
  item_id: number;
  item_mask: string;
  item_pic: string;
  item_price_coins: number;
  item_price_tokens: number;
  item_type: string;
}