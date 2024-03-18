import banner1 from '../images/banner_1.png';
import banner2 from '../images/banner_2.png';
import banner3 from '../images/banner_3.png';
console.log(banner1)
// advertisement banner data
export const bannersData = [
  {
    backgroundImage: `url(${banner1})`,
    // text: 'Зови друзей! + 500!',
    link: '/ad'
  },
  {
    backgroundImage: `url(${banner2})`,
    // text: 'Привет, корешок',
    link: '/nfg'
  },
  {
    backgroundImage: `url(${banner3})`,
    // text: 'Это слайдер номер 3, проверяем',
    link: '/404'
  },
];
// mock-leaders for leaderboard component
export const leadersData = [
  {
    img: "https://i.pravatar.cc",
    id: 1,
    username: 'Максим',
    gain: "+ 💵 900",
  },
  {
    img: "https://i.pravatar.cc",
    id: 2,
    username: 'lighterboii',
    gain: "+ 💵 430",
  },
  {
    img: "https://i.pravatar.cc",
    id: 3,
    username: 'darkz',
    gain: "+ 💵 254.5",
  },
  {
    img: "https://i.pravatar.cc",
    id: 4,
    username: 'adlaphtod',
    gain: "+ 💵 243",
  },
  {
    img: "https://i.pravatar.cc",
    id: 5,
    username: 'nigger',
    gain: "+ 💵 243",
  },
  {
    img: "https://i.pravatar.cc",
    id: 6,
    username: 'John Snow',
    gain: "+ 💵 198.56",
  },
  {
    img: "https://i.pravatar.cc",
    id: 7,
    username: 'Audrey',
    gain: "+ 💵 194",
  },
  {
    img: "https://i.pravatar.cc",
    id: 8,
    username: 'minimalTechno',
    gain: "+ 💵 166",
  },
  {
    img: "https://i.pravatar.cc",
    id: 9,
    username: 'BabuSHKA',
    gain: "+ 💵 100.1",
  },
]
// mock data for referrals user 
export const referrals = [
  {
    img: "https://i.pravatar.cc",
    id: 1,
    username: 'Travis Scott',
    gain: "+ 💵 9",
  },
  {
    img: "https://i.pravatar.cc",
    id: 2,
    username: 'hello_world',
    gain: "+ 💵 7",
  },
  {
    img: "https://i.pravatar.cc",
    id: 3,
    username: 'Kanye West',
    gain: "+ 💵 6.5",
  },
  {
    img: "https://i.pravatar.cc",
    id: 4,
    username: 'future',
    gain: "+ 💵 4",
  },
  {
    img: "https://i.pravatar.cc",
    id: 5,
    username: 'Ozzy Osbourne',
    gain: "+ 💵 4",
  },
  {
    img: "https://i.pravatar.cc",
    id: 6,
    username: 'Garrett Reynolds',
    gain: "+ 💵 4",
  },
];
// fake data for shop items
export const shopItems = [
  {
    id: 1,
    userAvatar: "https://i.pravatar.cc",
    skin: 1,
    skinType: 'skin',
    price: '120',
    isOwned: true,
  },
  {
    id: 2,
    userAvatar: "https://i.pravatar.cc",
    skin: 2,
    skinType: 'skin',
    price: '230',
    isOwned: false,
  },
  {
    id: 3,
    userAvatar: "https://i.pravatar.cc",
    skin: 3,
    skinType: 'skin',
    price: '155',
    isOwned: true,
  },
  {
    id: 4,
    userAvatar: "https://i.pravatar.cc",
    skin: 4,
    skinType: 'emoji',
    price: '114',
    isOwned: true,
  },
  {
    id: 5,
    userAvatar: "https://i.pravatar.cc",
    skin: 5,
    skinType: 'skin',
    price: '220',
    isOwned: false,
  },
  {
    id: 6,
    userAvatar: "https://i.pravatar.cc",
    skin: 6,
    skinType: 'skin',
    price: '190',
    isOwned: false,
  },
  {
    id: 7,
    userAvatar: "https://i.pravatar.cc",
    skin: 7,
    skinType: 'emoji',
    price: '300',
    isOwned: true,
  },
  {
    id: 8,
    userAvatar: "https://i.pravatar.cc",
    skin: 8,
    skinType: 'skin',
    price: '420',
    isOwned: false,
  },
  {
    id: 9,
    userAvatar: "https://i.pravatar.cc",
    skin: 10,
    skinType: 'skin',
    price: '99',
    isOwned: false,
  },
  {
    id: 9,
    userAvatar: "https://i.pravatar.cc",
    skin: 11,
    skinType: 'skin',
    price: '99',
    isOwned: false,
  },
  {
    id: 9,
    userAvatar: "https://i.pravatar.cc",
    skin: 12,
    skinType: 'skin',
    price: '99',
    isOwned: false,
  },
  {
    id: 9,
    userAvatar: "https://i.pravatar.cc",
    skin: 13,
    skinType: 'skin',
    price: '99',
    isOwned: false,
  },
  {
    id: 9,
    userAvatar: "https://i.pravatar.cc",
    skin: 14,
    skinType: 'skin',
    price: '99',
    isOwned: false,
  },
  {
    id: 9,
    userAvatar: "https://i.pravatar.cc",
    skin: 15,
    skinType: 'skin',
    price: '99',
    isOwned: false,
  },
];
// mock data for user skin shop 
export const userSkinsForSale = [
  {
    id: 1,
    item_count: 10,
    item_mask: "https://gamebottggw.ngrok.app/get_item_image_mask/13",
    item_pic: "https://gamebottggw.ngrok.app/get_item_image/13",
    item_price_coins: 3,
    item_price_tokens: 0,
    item_type: "skin_anim"
  },
  {
    id: 2,
    item_count: 7,
    item_mask: "https://gamebottggw.ngrok.app/get_item_image_mask/13",
    item_pic: "https://gamebottggw.ngrok.app/get_item_image/13",
    item_price_coins: 3,
    item_price_tokens: 0,
    item_type: "skin_anim"
  },
  {
    id: 3,
    item_count: 13,
    item_mask: "https://gamebottggw.ngrok.app/get_item_image_mask/14",
    item_pic: "https://gamebottggw.ngrok.app/get_item_image/14",
    item_price_coins: 3,
    item_price_tokens: 0,
    item_type: "skin_anim"
  },
];
// fake existing rooms data
export const openedRooms = [
  {
    id: 1,
    gameType: 'Камень/ножницы/бумага',
    creator: 'lighterboii',
    users: 1,
    bet: 1.2
  },
  {
    id: 2,
    gameType: 'Камень/ножницы/бумага',
    creator: 'hellboy',
    users: 1,
    bet: 0.7
  },
  {
    id: 3,
    gameType: 'Камень/ножницы/бумага',
    creator: 'moneyChaser',
    users: 1,
    bet: 0.95
  },
  {
    id: 4,
    gameType: 'Камень/ножницы/бумага',
    creator: 'go_fuck_yourself',
    users: 1,
    bet: 1.5
  },
  {
    id: 5,
    gameType: 'Камень/ножницы/бумага',
    creator: '9/11',
    users: 1,
    bet: 6
  },
  {
    id: 6,
    gameType: 'Камень/ножницы/бумага',
    creator: 'vyacheslav',
    users: 2,
    bet: 5.2
  },
  {
    id: 7,
    gameType: 'Камень/ножницы/бумага',
    creator: 'eminem',
    users: 1,
    bet: 2.5
  },
  {
    id: 8,
    gameType: 'Камень/ножницы/бумага',
    creator: '9/11',
    users: 1,
    bet: 14
  },
];
// gameData 
export const games = [
  {
    id: 1,
    name: 'Цу-е-фа',
    users: '2',
  },
  {
    id: 2,
    name: 'Кто ближе',
    users: '2-10'
  },
]