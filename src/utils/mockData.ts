import banner1 from '../images/banner_1.png';
import banner2 from '../images/banner_2.png';
import banner3 from '../images/banner_3.png';
import hand from '../images/main_hand_1_tiny.png';
import line from '../images/gameSec.png';
// advertisement banner data
export const bannersData = [
  {
    backgroundImage: `url(${banner1})`,
    text: 'Но «цуефа» точно пришла из Китая и на самом деле это именно «цу-е-фа», через дефис. Означать это должно «пожалуйста, начинайте», что как будто логично для предварения игры.20 авг. 2023 г.',
    link: '/ad',
    title: 'Очень рекламное сообщение из баннера, которое очень рекламное'
  },
  {
    backgroundImage: `url(${banner2})`,
    text: 'Привет, корешок',
    link: '/nfg',
    title: 'Это название второго баннера, привет'
  },
  {
    backgroundImage: `url(${banner3})`,
    text: 'Это слайдер номер 3, проверяем',
    link: '/404',
    title: 'Помогите, меня заставляют работать'
  },
];
// fake existing rooms data
export const openedRooms = [
  {
    id: 1,
    gameType: 'Цу-е-фа',
    creator: 'lighterboii',
    users: 1,
    bet: 1.2,
    currency: "coins"
  },
  {
    id: 2,
    gameType: 'Кто ближе',
    creator: 'hellboy',
    users: 1,
    bet: 0.7,
    currency: "tokens"
  },
  {
    id: 3,
    gameType: 'Цу-е-фа',
    creator: 'moneyChaser',
    users: 1,
    bet: 120,
    currency: "coins"
  },
  {
    id: 4,
    gameType: 'Цу-е-фа',
    creator: 'go_fuck_yourself',
    users: 1,
    bet: 1.5,
    currency: "tokens"
  },
  {
    id: 5,
    gameType: 'Цу-е-фа',
    creator: '9/11',
    users: 1,
    bet: 6,
    currency: "tokens"
  },
  {
    id: 6,
    gameType: 'Кто ближе',
    creator: 'vyacheslav',
    users: 2,
    bet: 5.2,
    currency: "coins"
  },
  {
    id: 7,
    gameType: 'Цу-е-фа',
    creator: 'eminem',
    users: 1,
    bet: 2.5,
    currency: "tokens"
  },
  {
    id: 8,
    gameType: 'Кто ближе',
    creator: 'mammolog',
    users: 1,
    bet: 14,
    currency: "tokens"
  },
];
// gameData 
export const games = [
  {
    id: 1,
    name: 'Цу-е-фа',
    users: '2',
    img: `url(${hand})`,
  },
  {
    id: 2,
    name: 'Кто ближе',
    users: '2-10',
    img: `url(${line})`,
  },
]