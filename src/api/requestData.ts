// eslint-disable-next-line max-len
// export const userId = 172359056;
export const userId = 5858080651;
const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// uri
export const mainAppDataUri = `get_start_info?user_id=`;
export const getUserAvatarUri = `getuserphoto?user_id=`;
export const getLeadersUri = `get_leaderboard_top_users`;
export const getLavkaUri = `get_lavka_available?user_id=`;
export const getRefsUri = `get_refs_info?user_id=`;
export const setCollectiblesUri = 'add_collectible?user_id=';
export const setActiveSkinUri = 'setactive_skin?user_id=';
export const buyShopItemUri = `shop_buy_item?user_id=`;
export const setTokensValueUri = `settokensnewvalue?user_id=`;
export const setCoinsValueUri = `setcoinsnewvalue?user_id=`;
export const buyLavkaUri = `buy_lavka?user_id=`;
export const sellLavkaUri = `add_sell_lavka?user_id=`;
export const cancelSellLavka = `cancel_sell_lavka?user_id=`;
export const setTransferCoinsUri = `transfer_refs_to_balance?user_id=`;
export const getRoomsUri = `getrooms?user_id=`
export const getCurrentRoomInfo = `getroominfo?room_id=`;
export const createRoomUri = `createroom?user_id=`
export const setActiveEmojiUri = `setactive_emoji?user_id=`;
export const addPlayerUri = `addplayer?user_id=`;
export const kickPlayerUri = `kickplayer?user_id=`;
export const setUserChoiceUri = `setchoice?user_id=`;
export const setEmojiUri = `setemoji?user_id=`;
export const whoIsWinUri = `whoiswin?user_id=`;
export const getEmojiPhUri = 'getemojiphoto';
export const pollingUri = 'polling?user_id=';
export const getGamesUri = 'get_existing_games';
export const activeEmojiPackUri = 'user_emoji?user_id=';
export const fortuneWheelUri = 'fortune_get_info?user_id=';
export const fortuneUri = 'fortune_button?user_id=';
export const getFortunePrizeUri = 'fortune_prize?user_id=';
export const taskStepButtonUri = 'task_step_button?user_id=';
export const taskResultUri = 'task_result_button?user_id=';
export const useEnergyDrinkUri = 'use_energy_drink?user_id=';
export const getShopUri = 'get_shop_available?=';
export const getInventoryUri = 'get_user_collectible_info?user_id=';
// links
export const getImageLink = `https://tgminiappgwbot.ngrok.app/get_item_image/`;
export const getImageMaskLink = `https://tgminiappgwbot.ngrok.app/get_item_image_mask/`
export const inviteLink = 'https://t.me/gowinclub_bot?start=invite_link';
export const groupLink = 'https://t.me/gowincommunity';
export const balanceLink = 'https://t.me/gowinclub_bot?start=balance';
// endpoints
export const itemIdParamString = '&item_id=';
export const itemCountParamString = '&count=';
export const collectiblesParamString = '&collectibles=';
export const addNewCollectibleParamString = '&add_collectible=';
export const activeSkinParamString = '&active_skin=';
export const newTokensParamString = '&newtokens=';
export const newCoinsParamString = '&newcoins=';
export const roomIdParamString = '&room_id=';
export const priceParamString = '&price=';
export const nftIdParamString = '&nft_id=';
export const playerChoiceParamString = '&choice=';
export const activeEmojiParamString = '&active_emoji=';
export const emojiIdParamString = '&emoji_id=';
export const emotionIdParamString = '&emotion_id=';
export const packIdParamString = '&pack_id=';
export const taskIdParamString = '&task_id=';
export const stepIdParamString = '&step_id=';
export const fortuneIdParamString = '&fortune_item_id=';
export const fortuneItemCountParamString = '&fortune_item_count=';