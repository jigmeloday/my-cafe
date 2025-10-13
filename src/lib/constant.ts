export const HEADER_MENU = [
  {
    id: 1,
    label: 'Home',
    link: '/'
  },
  {
    id: 2,
    label: 'Cafes',
    link: '/cafe-list'
  },
  {
    id: 3,
    label: 'Events',
    link: '/event-list'
  },
  
  {
    id: 4,
    label: 'Contact',
    link: '/contact'
  },
];

export const HEADER_MENU_OWNER = [
  {
    id: 1,
    label: 'Home',
    link: '/'
  },
    {
    id: 2,
    label: 'Dashboard',
    link: '/dashboard'
  },
  {
    id: 3,
    label: 'My Cafes',
    link: '/my-cafe'
  },
  {
    id: 4,
    label: 'Events',
    link: '/events'
  },
  
  {
    id: 5,
    label: 'Contact',
    link: '/contact'
  },
];


export const TIME_OPTION = [
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const CAFE_TABS = [
  {
    id: 1,
    label: 'Menu'
  },
  {
    id: 2,
    label: 'Overview'
  },
  {
    id: 3,
    label: 'Events'
  }
]

export const CATEGORY = [
  { id: 1, name: 'Coffee', slug: 'coffee' },
  { id: 2, name: 'Tea', slug: 'tea' },
  { id: 3, name: 'Smoothies', slug: 'smoothies' },
  { id: 4, name: 'Juices', slug: 'juices' },
  { id: 5, name: 'Bakery', slug: 'bakery' },
  { id: 6, name: 'Sandwiches', slug: 'sandwiches' },
  { id: 7, name: 'Burgers', slug: 'burgers' },
  { id: 8, name: 'Pizza', slug: 'pizza' },
  { id: 9, name: 'Patties', slug: 'patties' },
  { id: 10, name: 'Salads', slug: 'salads' },
  { id: 11, name: 'Desserts', slug: 'desserts' },
  { id: 12, name: 'Snacks', slug: 'snacks' },
  { id: 13, name: 'Specials', slug: 'specials' },
  { id: 14, name: 'Others', slug: 'other' },
];

export const DUMMY_MENU = [
  {
    id: '1',
    cafeId: 'cafe-1',
    name: 'Espresso',
    img: '/images/coffee/espresso.jpg',
    price: 3.5,
    spicyRate: 0,
    ingredients: ['Espresso beans', 'Water'],
    createdAt: new Date(),
  },
  {
    id: '2',
    cafeId: 'cafe-1',
    name: 'Latte',
    img: '/images/coffee/latte.jpg',
    price: 4.5,
    spicyRate: 0,
    ingredients: ['Espresso', 'Steamed milk', 'Foam'],
    createdAt: new Date(),
  },
  {
    id: '3',
    cafeId: 'cafe-1',
    name: 'Chicken Burger',
    img: '/images/food/chicken-burger.jpg',
    price: 6.0,
    spicyRate: 2,
    ingredients: ['Chicken patty', 'Lettuce', 'Tomato', 'Cheese', 'Bun'],
    createdAt: new Date(),
  },
  {
    id: '4',
    cafeId: 'cafe-1',
    name: 'Veggie Pizza',
    img: '/images/food/veggie-pizza.jpg',
    price: 8.5,
    spicyRate: 1,
    ingredients: ['Pizza base', 'Tomato sauce', 'Cheese', 'Bell peppers', 'Olives'],
    createdAt: new Date(),
  },
  {
    id: '5',
    cafeId: 'cafe-1',
    name: 'Chocolate Muffin',
    img: '/images/bakery/chocolate-muffin.jpg',
    price: 2.5,
    spicyRate: 0,
    ingredients: ['Flour', 'Cocoa', 'Sugar', 'Eggs', 'Butter'],
    createdAt: new Date(),
  },
];
