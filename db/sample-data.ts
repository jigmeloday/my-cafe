import {hashSync } from 'bcrypt-ts-edge'

export const CAFE_DATA = [
  {
    name: 'Starbuck',
    subTitle: 'Freshly brewed coffee every day',
    logo: '/banner/logo1.png',
    openTime: '07:00 AM',
    closeTime: '10:00 PM',
    themeColor: '#00704A', // Starbucks green
    isFeature: true,
  },
  {
    name: 'Cafe Mocha',
    subTitle: 'Cozy place for your coffee breaks',
    logo: '/banner/logo2.png',
    openTime: '08:00 AM',
    closeTime: '09:00 PM',
    themeColor: '#8B4513', // Chocolate brown
    isFeature: true,
  },
  {
    name: 'The Coffee House',
    subTitle: 'Your daily dose of caffeine',
    logo: '/banner/logo3.png',
    openTime: '06:30 AM',
    closeTime: '11:00 PM',
    themeColor: '#C27C0E', // Golden brown
    isFeature: true,
  },
  {
    name: 'Brew Haven',
    subTitle: 'Where every sip feels like home',
    logo: '/banner/logo4.png',
    openTime: '07:00 AM',
    closeTime: '09:30 PM',
    themeColor: '#6F4E37', // Coffee brown
    isFeature: true,
  },
  {
    name: 'Espresso Lab',
    subTitle: 'Experiment with flavor and aroma',
    logo: '/banner/logo1.png',
    openTime: '06:00 AM',
    closeTime: '08:00 PM',
    themeColor: '#3C2F2F', // Deep mocha
    isFeature: true,
  },
  {
    name: 'Latte Lounge',
    subTitle: 'For those who love creamy comfort',
    logo: '/banner/logo2.png',
    openTime: '07:30 AM',
    closeTime: '10:00 PM',
    themeColor: '#A67B5B', // Latte tan
    isFeature: true,
  },
  {
    name: 'Morning Roast',
    subTitle: 'Wake up to something special',
    logo: '/banner/logo3.png',
    openTime: '05:30 AM',
    closeTime: '08:30 PM',
    themeColor: '#8B5A2B', // Roast brown
    isFeature: false,
  },
  {
    name: 'The Bean Spot',
    subTitle: 'Great beans, better conversations',
    logo: '/banner/logo4.png',
    openTime: '06:00 AM',
    closeTime: '09:00 PM',
    themeColor: '#5C4033', // Earthy tone
    isFeature: false,
  },
  {
    name: 'Cafe Aroma',
    subTitle: 'Breathe in the scent of freshness',
    logo: '/banner/logo1.png',
    openTime: '07:00 AM',
    closeTime: '09:30 PM',
    themeColor: '#B5651D', // Aromatic brown
    isFeature: false,
  },
  {
    name: 'Bistro Beans',
    subTitle: 'A blend of style and taste',
    logo: '/banner/logo2.png',
    openTime: '08:00 AM',
    closeTime: '11:00 PM',
    themeColor: '#4B3832', // Deep roast
    isFeature: false,
  },
];

export const ADDRESS_DATA = [
  {
    cafeName: 'Starbuck',
    addresses: [
      {
        street: '12 Norzin Lam',
        city: 'Thimphu',
        state: 'Thimphu',
        zip: '11001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.4728,89.6390',
        createdAt: new Date(),
      },
      {
        street: '5 Changlam Rd',
        city: 'Thimphu',
        state: 'Thimphu',
        zip: '11002',
        country: 'Bhutan',
        isDefault: false,
        map: 'https://maps.google.com/?q=27.4710,89.6410',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Cafe Mocha',
    addresses: [
      {
        street: '45 Changlam Road',
        city: 'Paro',
        state: 'Paro',
        zip: '12001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.4315,89.4166',
        createdAt: new Date(),
      },
      {
        street: '10 Rinpung Dzong Rd',
        city: 'Paro',
        state: 'Paro',
        zip: '12002',
        country: 'Bhutan',
        isDefault: false,
        map: 'https://maps.google.com/?q=27.4280,89.4170',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'The Coffee House',
    addresses: [
      {
        street: '8 Clock Tower Ave',
        city: 'Phuentsholing',
        state: 'Chukha',
        zip: '21001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=26.8638,89.3883',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Brew Haven',
    addresses: [
      {
        street: '34 Punakha Main St',
        city: 'Punakha',
        state: 'Punakha',
        zip: '13001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.5920,89.8771',
        createdAt: new Date(),
      },
      {
        street: '2 Punakha Bazaar Rd',
        city: 'Punakha',
        state: 'Punakha',
        zip: '13002',
        country: 'Bhutan',
        isDefault: false,
        map: 'https://maps.google.com/?q=27.5900,89.8800',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Espresso Lab',
    addresses: [
      {
        street: '21 Bumthang Heritage Rd',
        city: 'Bumthang',
        state: 'Bumthang',
        zip: '32001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.5594,90.7520',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Latte Lounge',
    addresses: [
      {
        street: '9 Mongar Bazaar',
        city: 'Mongar',
        state: 'Mongar',
        zip: '43001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.2747,91.2395',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Morning Roast',
    addresses: [
      {
        street: '5 Trongsa Dzong View Rd',
        city: 'Trongsa',
        state: 'Trongsa',
        zip: '36001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.5022,90.5075',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'The Bean Spot',
    addresses: [
      {
        street: '18 Trashigang Central St',
        city: 'Trashigang',
        state: 'Trashigang',
        zip: '42001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.3333,91.5530',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Cafe Aroma',
    addresses: [
      {
        street: '22 Samdrup Jongkhar Rd',
        city: 'Samdrup Jongkhar',
        state: 'Samdrup Jongkhar',
        zip: '51001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=26.8000,91.5000',
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Bistro Beans',
    addresses: [
      {
        street: '16 Wangdue Town',
        city: 'Wangdue Phodrang',
        state: 'Wangdue Phodrang',
        zip: '14001',
        country: 'Bhutan',
        isDefault: true,
        map: 'https://maps.google.com/?q=27.4333,89.9167',
        createdAt: new Date(),
      },
    ],
  },
];

export const MENU_DATA = [
  {
    cafeName: 'Starbuck',
    menus: [
      { name: 'Caffe Latte', img: 'https://images.unsplash.com/photo-1627777620905-53a332869051?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.5, spicyRate: 0, ingredients: ['Espresso', 'Steamed milk'], createdAt: new Date() },
      { name: 'Cappuccino', img: 'https://images.unsplash.com/photo-1557772747-77ffbcf6b117?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.8, spicyRate: 0, ingredients: ['Espresso', 'Steamed milk', 'Foam'], createdAt: new Date() },
      { name: 'Mocha', img: 'https://images.unsplash.com/photo-1557772611-722dabe20327?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 4.0, spicyRate: 0, ingredients: ['Espresso', 'Chocolate', 'Steamed milk'], createdAt: new Date() },
    ],
  },
  {
    cafeName: 'Cafe Mocha',
    menus: [
      { name: 'Hot Chocolate', img: 'https://images.unsplash.com/photo-1739542856859-d8014313ac21?q=80&w=997&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.0, spicyRate: 0, ingredients: ['Chocolate', 'Milk'], createdAt: new Date() },
      { name: 'Iced Coffee', img: 'https://plus.unsplash.com/premium_photo-1672406486484-5452af231a51?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.2, spicyRate: 0, ingredients: ['Coffee', 'Ice', 'Milk'], createdAt: new Date() },
      { name: 'Caramel Macchiato', img: 'https://images.unsplash.com/photo-1637572815755-c4b80092dce1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 4.0, spicyRate: 0, ingredients: ['Espresso', 'Milk', 'Caramel syrup'], createdAt: new Date() },
    ],
  },
  {
    cafeName: 'The Coffee House',
    menus: [
      { name: 'Espresso', img: 'https://images.unsplash.com/photo-1628568755138-7fc8b8f63031?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 2.5, spicyRate: 0, ingredients: ['Pure espresso shot'], createdAt: new Date() },
      { name: 'Americano', img: 'https://images.unsplash.com/photo-1584825285640-ed85c96f3667?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.0, spicyRate: 0, ingredients: ['Espresso', 'Hot water'], createdAt: new Date() },
      { name: 'Flat White', img: 'https://images.unsplash.com/photo-1567041747112-3f000732e361?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.5, spicyRate: 0, ingredients: ['Espresso', 'Steamed milk'], createdAt: new Date() },
    ],
  },
  {
    cafeName: 'Brew Haven',
    menus: [
      { name: 'Flat White', img: 'https://images.unsplash.com/photo-1580855783586-77a1be77b611?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0', price: 3.5, spicyRate: 0, ingredients: ['Espresso', 'Steamed milk'], createdAt: new Date() },
      { name: 'Caramel Latte', img: 'https://images.unsplash.com/photo-1630328868131-07902c2e6734?q=80&w=561&auto=format&fit=crop&ixlib=rb-4.1.0', price: 4.2, spicyRate: 0, ingredients: ['Espresso', 'Milk', 'Caramel syrup'], createdAt: new Date() },
      { name: 'Vanilla Latte', img: 'https://images.unsplash.com/photo-1637085046560-43cc153c86e0?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0', price: 4.0, spicyRate: 0, ingredients: ['Espresso', 'Milk', 'Vanilla syrup'], createdAt: new Date() },
    ],
  },
];

export const BANNER_DATA = [
  {
    cafeName: 'Starbuck',
    banners: [
      {
        title: 'Grand Opening!',
        subtitle: 'Step in and savor the aroma of freshly brewed perfection. Your coffee journey starts here!',
        imageUrl: 'https://plus.unsplash.com/premium_photo-1664970900025-1e3099ca757a?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        buttonText: 'Visit Now',
        link: '/menu',
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Cafe Mocha',
    banners: [
      {
        title: 'Chocolate Lovers Week!',
        subtitle: 'Indulge in rich, velvety chocolate drinks crafted for the true cocoa enthusiast.',
        imageUrl: 'https://images.unsplash.com/photo-1621221814631-e8bfdabd5ca4?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        buttonText: 'Explore',
        link: '/menu',
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'Espresso Lab',
    banners: [
      {
        title: 'Flavor Experiments',
        subtitle: 'Discover bold new blends and flavors. Every cup is a scientific delight!',
        imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
        buttonText: 'Join Event',
        link: '/events',
        active: false,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        createdAt: new Date(),
      },
      {
        title: 'New Cold Brew Series',
        subtitle: 'Cool, smooth, and perfectly brewed. Experience coffee like never before.',
        imageUrl: 'https://images.unsplash.com/photo-1598533719727-86119a152259?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        buttonText: 'Try Now',
        link: '/menu',
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 10)),
        createdAt: new Date(),
      },
    ],
  },
  {
    cafeName: 'The Bean Spot',
    banners: [
      {
        title: 'Coffee Conversations',
        subtitle: 'Sip, chat, and create memories. Every cup sparks a new story!',
        imageUrl: 'https://images.unsplash.com/photo-1558122104-355edad709f6?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        buttonText: 'Visit Us',
        link: '/about',
        active: true,
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        createdAt: new Date(),
      },
    ],
  },
];

export const ROLE = [
  {
    name: 'super_admin',
  }, 
  {
    name: 'owner'
  },
  {
    name: 'user'
  }
]

export const USER = [
  {
    name: 'Jigme Lodey',
    email: 'jl@gmail.com',
    password: hashSync('Test@123', 10),
  },
  {
    name: 'Jigme Owner',
    email: 'owner@gmail.com',
    password: hashSync('Test@123', 10),
  },
  {
    name: 'Jigme User',
    email: 'user@gmail.com',
    password: hashSync('Test@123', 10),
  }
]


export const CATEGORY = [
  { name: 'Coffee' },
  { name: 'Tea' },
  { name: 'Smoothies' },
  { name: 'Juices' },
  { name: 'Bakery' },
  { name: 'Sandwiches' },
  { name: 'Burgers' },
  { name: 'Pizza' },
  { name: 'Patties' },
  { name: 'Salads' },
  { name: 'Desserts' },
  { name: 'Snacks' },
  { name: 'Specials'},
  { name: 'Others' },
];