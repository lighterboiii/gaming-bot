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
// gameData 
export const games = [
  {
    id: 1,
    room_type: 1,
    name: 'Цу-е-фа',
    users: '2',
    img: `url(${hand})`,
  },
  {
    id: 2,
    room_type: 2,
    name: 'Кто ближе',
    users: '2-10',
    img: `url(${line})`,
  },
]