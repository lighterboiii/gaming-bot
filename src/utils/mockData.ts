import banner1 from '../images/banner_1.png';
import banner2 from '../images/banner_2.png';
import banner3 from '../images/banner_3.png';
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