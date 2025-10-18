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
  ...HEADER_MENU.filter((item) => item.link !== '/cafe-list'),
  
    {
    id: 5,
    label: 'Dashboard',
    link: '/dashboard'
  },
  {
    id: 6,
    label: 'My Cafes',
    link: '/my-cafe'
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


export const COUNTRY_CODE = [
    {
        'code': '+93',
        'flag': '/images/flags/AF.svg',
        'abbreviation': 'AF',
        'name': 'Afghanistan'
    },
    {
        'code': '+355',
        'flag': '/images/flags/AL.svg',
        'abbreviation': 'AL',
        'name': 'Albania'
    },
    {
        'code': '+213',
        'flag': '/images/flags/DZ.svg',
        'abbreviation': 'DZ',
        'name': 'Algeria'
    },
    {
        'code': '+1-684',
        'flag': '/images/flags/AS.svg',
        'abbreviation': 'AS',
        'name': 'American Samoa'
    },
    {
        'code': '+376',
        'flag': '/images/flags/AD.svg',
        'abbreviation': 'AD',
        'name': 'Andorra'
    },
    {
        'code': '+244',
        'flag': '/images/flags/AO.svg',
        'abbreviation': 'AO',
        'name': 'Angola'
    },
    {
        'code': '+1-264',
        'flag': '/images/flags/AI.svg',
        'abbreviation': 'AI',
        'name': 'Anguilla'
    },
    {
        'code': '+672',
        'flag': '/images/flags/AQ.svg',
        'abbreviation': 'AQ',
        'name': 'Antarctica'
    },
    {
        'code': '+1-268',
        'flag': '/images/flags/AG.svg',
        'abbreviation': 'AG',
        'name': 'Antigua and Barbuda'
    },
    {
        'code': '+54',
        'flag': '/images/flags/AR.svg',
        'abbreviation': 'AR',
        'name': 'Argentina'
    },
    {
        'code': '+374',
        'flag': '/images/flags/AM.svg',
        'abbreviation': 'AM',
        'name': 'Armenia'
    },
    {
        'code': '+297',
        'flag': '/images/flags/AW.svg',
        'abbreviation': 'AW',
        'name': 'Aruba'
    },
    {
        'code': '+61',
        'flag': '/images/flags/AU.svg',
        'abbreviation': 'AU',
        'name': 'Australia'
    },
    {
        'code': '+43',
        'flag': '/images/flags/AT.svg',
        'abbreviation': 'AT',
        'name': 'Austria'
    },
    {
        'code': '+994',
        'flag': '/images/flags/AZ.svg',
        'abbreviation': 'AZ',
        'name': 'Azerbaijan'
    },
    {
        'code': '+1-242',
        'flag': '/images/flags/BS.svg',
        'abbreviation': 'BS',
        'name': 'Bahamas'
    },
    {
        'code': '+973',
        'flag': '/images/flags/BH.svg',
        'abbreviation': 'BH',
        'name': 'Bahrain'
    },
    {
        'code': '+880',
        'flag': '/images/flags/BD.svg',
        'abbreviation': 'BD',
        'name': 'Bangladesh'
    },
    {
        'code': '+1-246',
        'flag': '/images/flags/BB.svg',
        'abbreviation': 'BB',
        'name': 'Barbados'
    },
    {
        'code': '+375',
        'flag': '/images/flags/BY.svg',
        'abbreviation': 'BY',
        'name': 'Belarus'
    },
    {
        'code': '+32',
        'flag': '/images/flags/BE.svg',
        'abbreviation': 'BE',
        'name': 'Belgium'
    },
    {
        'code': '+501',
        'flag': '/images/flags/BZ.svg',
        'abbreviation': 'BZ',
        'name': 'Belize'
    },
    {
        'code': '+229',
        'flag': '/images/flags/BJ.svg',
        'abbreviation': 'BJ',
        'name': 'Benin'
    },
    {
        'code': '+1-441',
        'flag': '/images/flags/BM.svg',
        'abbreviation': 'BM',
        'name': 'Bermuda'
    },
    {
        'code': '+975',
        'flag': '/images/flags/BT.svg',
        'abbreviation': 'BT',
        'name': 'Bhutan'
    },
    {
        'code': '+591',
        'flag': '/images/flags/BO.svg',
        'abbreviation': 'BO',
        'name': 'Bolivia'
    },
    {
        'code': '+387',
        'flag': '/images/flags/BA.svg',
        'abbreviation': 'BA',
        'name': 'Bosnia and Herzegovina'
    },
    {
        'code': '+267',
        'flag': '/images/flags/BW.svg',
        'abbreviation': 'BW',
        'name': 'Botswana'
    },
    {
        'code': '+55',
        'flag': '/images/flags/BR.svg',
        'abbreviation': 'BR',
        'name': 'Brazil'
    },
    {
        'code': '+246',
        'flag': '/images/flags/IO.svg',
        'abbreviation': 'IO',
        'name': 'British Indian Ocean Territory'
    },
    {
        'code': '+1-284',
        'flag': '/images/flags/VG.svg',
        'abbreviation': 'VG',
        'name': 'British Virgin Islands'
    },
    {
        'code': '+673',
        'flag': '/images/flags/BN.svg',
        'abbreviation': 'BN',
        'name': 'Brunei'
    },
    {
        'code': '+359',
        'flag': '/images/flags/BG.svg',
        'abbreviation': 'BG',
        'name': 'Bulgaria'
    },
    {
        'code': '+226',
        'flag': '/images/flags/BF.svg',
        'abbreviation': 'BF',
        'name': 'Burkina Faso'
    },
    {
        'code': '+257',
        'flag': '/images/flags/BI.svg',
        'abbreviation': 'BI',
        'name': 'Burundi'
    },
    {
        'code': '+855',
        'flag': '/images/flags/KH.svg',
        'abbreviation': 'KH',
        'name': 'Cambodia'
    },
    {
        'code': '+237',
        'flag': '/images/flags/CM.svg',
        'abbreviation': 'CM',
        'name': 'Cameroon'
    },
    {
        'code': '+1',
        'flag': '/images/flags/CA.svg',
        'abbreviation': 'CA',
        'name': 'Canada'
    },
    {
        'code': '+238',
        'flag': '/images/flags/CV.svg',
        'abbreviation': 'CV',
        'name': 'Cape Verde'
    },
    {
        'code': '+1-345',
        'flag': '/images/flags/KY.svg',
        'abbreviation': 'KY',
        'name': 'Cayman Islands'
    },
    {
        'code': '+236',
        'flag': '/images/flags/CF.svg',
        'abbreviation': 'CF',
        'name': 'Central African Republic'
    },
    {
        'code': '+235',
        'flag': '/images/flags/TD.svg',
        'abbreviation': 'TD',
        'name': 'Chad'
    },
    {
        'code': '+56',
        'flag': '/images/flags/CL.svg',
        'abbreviation': 'CL',
        'name': 'Chile'
    },
    {
        'code': '+86',
        'flag': '/images/flags/CN.svg',
        'abbreviation': 'CN',
        'name': 'China'
    },
    {
        'code': '+61',
        'flag': '/images/flags/CX.svg',
        'abbreviation': 'CX',
        'name': 'Christmas Island'
    },
    {
        'code': '+61',
        'flag': '/images/flags/CC.svg',
        'abbreviation': 'CC',
        'name': 'Cocos Islands'
    },
    {
        'code': '+57',
        'flag': '/images/flags/CO.svg',
        'abbreviation': 'CO',
        'name': 'Colombia'
    },
    {
        'code': '+269',
        'flag': '/images/flags/KM.svg',
        'abbreviation': 'KM',
        'name': 'Comoros'
    },
    {
        'code': '+242',
        'flag': '/images/flags/CG.svg',
        'abbreviation': 'CG',
        'name': 'Congo'
    },
    {
        'code': '+243',
        'flag': '/images/flags/CD.svg',
        'abbreviation': 'CD',
        'name': 'Democratic Republic of the Congo'
    },
    {
        'code': '+682',
        'flag': '/images/flags/CK.svg',
        'abbreviation': 'CK',
        'name': 'Cook Islands'
    },
    {
        'code': '+506',
        'flag': '/images/flags/CR.svg',
        'abbreviation': 'CR',
        'name': 'Costa Rica'
    },
    {
        'code': '+225',
        'flag': '/images/flags/CI.svg',
        'abbreviation': 'CI',
        'name': 'Cote d\'Ivoire'
    },
    {
        'code': '+385',
        'flag': '/images/flags/HR.svg',
        'abbreviation': 'HR',
        'name': 'Croatia'
    },
    {
        'code': '+53',
        'flag': '/images/flags/CU.svg',
        'abbreviation': 'CU',
        'name': 'Cuba'
    },
    {
        'code': '+599',
        'flag': '/images/flags/CW.svg',
        'abbreviation': 'CW',
        'name': 'Curacao'
    },
    {
        'code': '+357',
        'flag': '/images/flags/CY.svg',
        'abbreviation': 'CY',
        'name': 'Cyprus'
    },
    {
        'code': '+420',
        'flag': '/images/flags/CZ.svg',
        'abbreviation': 'CZ',
        'name': 'Czech Republic'
    },
    {
        'code': '+45',
        'flag': '/images/flags/DK.svg',
        'abbreviation': 'DK',
        'name': 'Denmark'
    },
    {
        'code': '+253',
        'flag': '/images/flags/DJ.svg',
        'abbreviation': 'DJ',
        'name': 'Djibouti'
    },
    {
        'code': '+1-767',
        'flag': '/images/flags/DM.svg',
        'abbreviation': 'DM',
        'name': 'Dominica'
    },
    {
        'code': '+1-809, +1-829, +1-849',
        'flag': '/images/flags/DO.svg',
        'abbreviation': 'DO',
        'name': 'Dominican Republic'
    },
    {
        'code': '+670',
        'flag': '/images/flags/TL.svg',
        'abbreviation': 'TL',
        'name': 'East Timor'
    },
    {
        'code': '+593',
        'flag': '/images/flags/EC.svg',
        'abbreviation': 'EC',
        'name': 'Ecuador'
    },
    {
        'code': '+20',
        'flag': '/images/flags/EG.svg',
        'abbreviation': 'EG',
        'name': 'Egypt'
    },
    {
        'code': '+503',
        'flag': '/images/flags/SV.svg',
        'abbreviation': 'SV',
        'name': 'El Salvador'
    },
    {
        'code': '+506',
        'flag': '/images/flags/GQ.svg',
        'abbreviation': 'GQ',
        'name': 'Equatorial Guinea'
    },
    {
        'code': '+291',
        'flag': '/images/flags/ER.svg',
        'abbreviation': 'ER',
        'name': 'Eritrea'
    },
    {
        'code': '+372',
        'flag': '/images/flags/EE.svg',
        'abbreviation': 'EE',
        'name': 'Estonia'
    },
    {
        'code': '+268',
        'flag': '/images/flags/SZ.svg',
        'abbreviation': 'SZ',
        'name': 'Eswatini'
    },
    {
        'code': '+46',
        'flag': '/images/flags/SE.svg',
        'abbreviation': 'SE',
        'name': 'Sweden'
    },
    {
        'code': '+41',
        'flag': '/images/flags/CH.svg',
        'abbreviation': 'CH',
        'name': 'Switzerland'
    },
    {
        'code': '+963',
        'flag': '/images/flags/SY.svg',
        'abbreviation': 'SY',
        'name': 'Syria'
    },
    {
        'code': '+886',
        'flag': '/images/flags/TW.svg',
        'abbreviation': 'TW',
        'name': 'Taiwan'
    },
    {
        'code': '+992',
        'flag': '/images/flags/TJ.svg',
        'abbreviation': 'TJ',
        'name': 'Tajikistan'
    },
    {
        'code': '+255',
        'flag': '/images/flags/TZ.svg',
        'abbreviation': 'TZ',
        'name': 'Tanzania'
    },
    {
        'code': '+66',
        'flag': '/images/flags/TH.svg',
        'abbreviation': 'TH',
        'name': 'Thailand'
    },
    {
        'code': '+228',
        'flag': '/images/flags/TG.svg',
        'abbreviation': 'TG',
        'name': 'Togo'
    },
    {
        'code': '+690',
        'flag': '/images/flags/TK.svg',
        'abbreviation': 'TK',
        'name': 'Tokelau'
    },
    {
        'code': '+676',
        'flag': '/images/flags/TO.svg',
        'abbreviation': 'TO',
        'name': 'Tonga'
    },
    {
        'code': '+1-868',
        'flag': '/images/flags/TT.svg',
        'abbreviation': 'TT',
        'name': 'Trinidad and Tobago'
    },
    {
        'code': '+216',
        'flag': '/images/flags/TN.svg',
        'abbreviation': 'TN',
        'name': 'Tunisia'
    },
    {
        'code': '+90',
        'flag': '/images/flags/TR.svg',
        'abbreviation': 'TR',
        'name': 'Turkey'
    },
    {
        'code': '+993',
        'flag': '/images/flags/TM.svg',
        'abbreviation': 'TM',
        'name': 'Turkmenistan'
    },
    {
        'code': '+688',
        'flag': '/images/flags/TV.svg',
        'abbreviation': 'TV',
        'name': 'Tuvalu'
    },
    {
        'code': '+256',
        'flag': '/images/flags/UG.svg',
        'abbreviation': 'UG',
        'name': 'Uganda'
    },
    {
        'code': '+380',
        'flag': '/images/flags/UA.svg',
        'abbreviation': 'UA',
        'name': 'Ukraine'
    },
    {
        'code': '+971',
        'flag': '/images/flags/AE.svg',
        'abbreviation': 'AE',
        'name': 'United Arab Emirates'
    },
    {
        'code': '+44',
        'flag': '/images/flags/GB.svg',
        'abbreviation': 'GB',
        'name': 'United Kingdom'
    },
    {
        'code': '+1',
        'flag': '/images/flags/US.svg',
        'abbreviation': 'US',
        'name': 'United States'
    },
    {
        'code': '+598',
        'flag': '/images/flags/UY.svg',
        'abbreviation': 'UY',
        'name': 'Uruguay'
    },
    {
        'code': '+998',
        'flag': '/images/flags/UZ.svg',
        'abbreviation': 'UZ',
        'name': 'Uzbekistan'
    },
    {
        'code': '+678',
        'flag': '/images/flags/VU.svg',
        'abbreviation': 'VU',
        'name': 'Vanuatu'
    },
    {
        'code': '+379',
        'flag': '/images/flags/VA.svg',
        'abbreviation': 'VA',
        'name': 'Vatican City'
    },
    {
        'code': '+58',
        'flag': '../../../../../assets/Images/flags/VE.svg',
        'abbreviation': 'VE',
        'name': 'Venezuela'
    },
    {
        'code': '+84',
        'flag': '/images/flags/VN.svg',
        'abbreviation': 'VN',
        'name': 'Vietnam'
    },
    {
        'code': '+681',
        'flag': '/images/flags/WF.svg',
        'abbreviation': 'WF',
        'name': 'Wallis and Futuna'
    },
    {
        'code': '+967',
        'flag': '/images/flags/YE.svg',
        'abbreviation': 'YE',
        'name': 'Yemen'
    },
    {
        'code': '+260',
        'flag': '/images/flags/ZM.svg',
        'abbreviation': 'ZM',
        'name': 'Zambia'
    },
    {
        'code': '+263',
        'flag': '/images/flags/ZW.svg',
        'abbreviation': 'ZW',
        'name': 'Zimbabwe'
    }
];
