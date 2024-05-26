export interface IGameCardData {
  id: number;
  room_type: number;
  bet_type: number;
  url: string;
  users: string;
}

export interface IRPSPlayer {
  active_skin: number;
  avatar: string;
  choice: string;
  emoji: string;
  item_mask: string;
  item_pic: string;
  money: number;
  prev_choice: string;
  publicname: string;
  tokens: number;
  userid: number;
}

export interface IRPSGameData {
  bet: string;
  bet_type: string;
  creator_id: string;
  free_places: string;
  misc_value: string;
  players: IRPSPlayer[];
  players_count: string;
  room_id: string;
  room_type: string;
}