export interface IGameCardData {
  id: number;
  room_type: number;
  bet_type: number;
  url: string;
  users: string;
}

export interface IPlayer {
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

export interface IGameData {
  bet: string;
  bet_type: string;
  creator_id: string;
  free_places: string;
  misc_value: string;
  players: IPlayer[];
  players_count: string;
  room_id: string;
  room_type: string;
}

export interface IPlayerInfo {
  choice: string;
  emoji: string;
  money: number;
  prev_choice: string;
  public_name: string;
  tokens: number;
  userid: number;
  username: string;
  username_lang: string;
}

export interface IGameSettingsData {
  id: number;
  room_type: number;
  url: string;
  users: string;
}

export interface IPropsForClosestNumberComponent {
  users: IPlayer[];
}

export interface ITime {
  days: number | string;
  hours: number | string;
  minutes: number | string;
}
