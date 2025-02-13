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
  hands?: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  win: any;
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
  playerEmojis: Record<number, string>;
}

export interface IPlayersProps {
  data: IGameData;
  playerEmojis: Record<number, string>;
}

export interface ITime {
  days: number | string;
  hours: number | string;
  minutes: number | string;
}

export interface IWinner {
  item: {
    item_pic: string;
    item_mask: string;
  };
  user_name: string;
  user_pic: string;
  winner_value: string;
}

export interface ILudkaUser {
  userid: number;
  money: number;
  tokens: number;
  user_name: string;
  user_pic: string;
  item_pic?: string;
  item_mask?: string;
  coins?: number;
  publicname?: string;
  avatar?: string;
}

export interface ILudkaGameData {
  players: ILudkaUser[];
  bet: string;
  bet_type: string;
  players_count: string;
  win: {
    users: ILudkaUser[] | "none";
    winner_value: string;
  };
}

export interface IRPSGameState {
  data: IGameData | null;
  loading: boolean;
  message: string;
  messageVisible: boolean;
  animation: string | null;
  playersAnim: {
    firstAnim: string | null;
    secondAnim: string | null;
  };
}

export interface IRPSOverlayState {
  showEmoji: boolean;
  showRules: boolean | null;
}

export interface IRPSTimerState {
  value: number;
  started: boolean;
  show: boolean;
}

export interface ILudkaGameState {
  data: ILudkaGameData | null;
  winner: IWinner | null;
  loading: boolean;
}

export interface ILudkaOverlayState {
  show: boolean;
  isVisible: boolean;
  inputValue: string;
  inputError: boolean;
}

export interface ILudkaLogState {
  show: boolean;
  isVisible: boolean;
  resetHistory: boolean;
}

export interface IEmojiOverlayProps {
  show: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

export interface ILudkaOverlayProps {
  isVisible: boolean;
  inputValue: string;
  inputError: boolean;
  onKeyPress: (key: number) => void;
  onDelete: () => void;
  onDecimalPoint: () => void;
  onSubmit: () => void;
  overlayRef: React.RefObject<HTMLDivElement>;
}

export interface ILogOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  overlayRef: React.RefObject<HTMLDivElement>;
  users: ILudkaUser[] | "none";
  shouldReset?: boolean;
}

export interface IGameAnswerInfo {
  message: 'coin_good' | 'coin_bad' | 'coin_withdrawn';
  player_id: number;
  room_id: number;
  next_x: string;
  animation: string;
  animation_front: string;
  mini_star_1: string;
  mini_star_2: string;
  mini_star_3: string;
  mini_star_4: string;
  mini_star_5: string;
  win_animation: string;
}

export interface IMonetkaGameData extends IGameData {
  game_answer_info: IGameAnswerInfo;
  type: string;
}

export interface IMonetkaGameState {
  data: IMonetkaGameData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  winner: any;
  loading: boolean;
}

export type ButtonState = 'default' | 'hover' | 'down';
export type CoinAnimationState = 'default' | 'redTint' | 'disappear' | 'appear';
