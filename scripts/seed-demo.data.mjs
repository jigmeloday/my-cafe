// The demo content. Names are made up. Dates are relative to today (a number of days from now), so the
// data always looks current: "ends today", "this weekend" and so on.

export const DEMO_PASSWORD = "Demo-pass-123";
export const DEMO_EMAIL_DOMAIN = "demo.kuzu.test";

export const CATEGORIES = ["Festival", "Food", "Cafés", "Fashion", "Phones", "Stays", "Wellness", "Events", "Kids", "Home", "Services"];

const HOURS = (open = "09:00", close = "18:00", sundayClosed = true) =>
  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => ({
    day,
    closed: sundayClosed && i === 6,
    open: i === 5 ? "10:00" : open,
    close: i === 5 ? "20:00" : close,
  }));

// promotion fields: [title, type, status, discount, description, startOffset, endOffset|null, category, extra?]
// startOffset / endOffset are days from today. status "PUBLISHED" | "DRAFT" | "ENDED".
export const BUSINESSES = [
  {
    key: "druk-pizzeria",
    name: "Druk Pizzeria",
    tagline: "Wood-fired pizza, made fresh",
    description: "A family-run pizzeria in Motithang. Hand-stretched dough, local cheese and a wood-fired oven that never stops on weekends.\n\nDine in, take away or order for your next gathering.",
    town: "Motithang", dzongkhag: "Thimphu", line1: "Motithang Main Road", phone: "+97517100101", website: "https://drukpizzeria.example.bt",
    status: "VERIFIED", openedDaysAgo: 120, hours: HOURS("11:00", "22:00", false),
    services: ["Dine-in", "Takeaway", "Catering"], products: ["Margherita", "Ema datshi pizza", "Garlic bread"], purchased: 1000,
    promotions: [
      ["Second pizza free on Fridays", "DEAL", "PUBLISHED", "Buy 1 get 1", "Order any pizza on a Friday evening and get a second one of equal or lesser value free. Dine-in only, from 5 pm.", -40, null, "Food", { popularity: 9 }],
      ["Lunch set, two for one", "DEAL", "PUBLISHED", "Buy 1 get 1", "Our weekday lunch set (pizza, salad and a drink) for two people at the price of one. Today only.", -2, 0, "Food", { popularity: 6 }],
      ["Wood-fired pizza night", "EVENT", "PUBLISHED", "Free entry", "Watch our chefs stretch, top and fire pizzas live. Free tasting slices for the first fifty guests.", 5, 5, "Events", { popularity: 4 }],
      ["Student discount", "DEAL", "DRAFT", "", "", 0, null, "", {}],
    ],
  },
  {
    key: "norbu-textiles",
    name: "Norbu Textiles",
    tagline: "Hand-woven kira, gho and more",
    description: "Weavers from Khoma supply our cloth, and our tailors finish every piece in store. Find kira, gho, scarves and gifts made to last.",
    town: "Norzin Lam", dzongkhag: "Thimphu", line1: "Norzin Lam, near the clock tower", phone: "+97517100102", website: "https://norbutextiles.example.bt",
    status: "VERIFIED", openedDaysAgo: 300, hours: HOURS("09:30", "19:00"),
    services: ["Tailoring", "Alterations", "Gift wrapping"], products: ["Hand-woven kira", "Gho", "Wool scarves"], purchased: 1500,
    promotions: [
      ["Hand-woven kira for Tshechu", "SALE", "PUBLISHED", "20% off", "Dress up for the festival with 20% off every hand-woven kira in store. Tailoring takes three days, so order early.", -10, 3, "Fashion", { popularity: 10 }],
      ["Winter coats clearance", "SALE", "PUBLISHED", "40% off", "Last winter's coats and jackets, up to 40% off while stock lasts.", -5, 7, "Fashion", { popularity: 5 }],
      ["Weaving demonstration day", "EVENT", "PUBLISHED", "Free entry", "Meet the weavers and try the loom yourself. Light refreshments served.", 9, 9, "Events", { popularity: 3 }],
      ["Summer sale", "SALE", "ENDED", "30% off", "Our summer clearance. Thank you to everyone who came.", -120, -90, "Fashion", { popularity: 7 }],
    ],
  },
  {
    key: "digital-hub",
    name: "Digital Hub",
    tagline: "Phones, laptops and honest repairs",
    description: "Authorised phone dealer and repair centre in the heart of town. Bring your old device and we will make you a fair trade-in offer.",
    town: "Town centre", dzongkhag: "Thimphu", line1: "Chang Lam, Town centre", phone: "+97577100103", website: "https://digitalhub.example.bt",
    status: "VERIFIED", openedDaysAgo: 500, hours: HOURS("09:00", "19:30", false),
    services: ["Screen repair", "Laptop service", "Data transfer"], products: ["Smartphones", "Earbuds", "Chargers"], purchased: 1000,
    promotions: [
      ["Phone trade-in offer", "DEAL", "PUBLISHED", "15% off", "Trade in any working phone and take 15% off a new one. Bring your ID and the original charger if you have it.", -20, 6, "Phones", { popularity: 8 }],
      ["Wireless earbuds sale", "SALE", "PUBLISHED", "25% off", "Selected wireless earbuds at 25% off this week only.", -4, 2, "Phones", { popularity: 7 }],
      ["Laptop service check", "SERVICE", "PUBLISHED", "Free diagnosis", "Slow or noisy laptop? We will diagnose it for free and tell you honestly what it needs.", -15, 12, "Services", { popularity: 4 }],
    ],
  },
  {
    key: "serene-spa",
    name: "Serene Spa",
    tagline: "Quiet, warm and unhurried",
    description: "A calm space in Babesa for hot stone baths, massage and facials. Book ahead on weekends.",
    town: "Babesa", dzongkhag: "Thimphu", line1: "Babesa Expressway", phone: "+97517100104", website: "",
    status: "VERIFIED", openedDaysAgo: 9, hours: HOURS("10:00", "20:00", false),
    services: ["Hot stone bath", "Massage", "Facials"], products: ["Massage oil", "Herbal tea"], purchased: 500,
    promotions: [
      ["Hot stone bath package", "SERVICE", "PUBLISHED", "Free massage oil", "Book a hot stone bath and take home a bottle of our house massage oil, free.", -12, 8, "Wellness", { popularity: 8 }],
      ["Launch week: first visit 20% off", "DEAL", "PUBLISHED", "20% off", "Welcome offer for first-time guests during our opening fortnight.", -8, 6, "Wellness", { popularity: 6 }],
    ],
  },
  {
    key: "sunrise-bakery",
    name: "Sunrise Bakery",
    tagline: "Fresh bread, every morning",
    description: "Baking since 5 am. Loaves, rolls, cakes and pastries, and half price on whatever is left after 7 pm.",
    town: "Chubachu", dzongkhag: "Thimphu", line1: "Chubachu Road", phone: "+97517100105", website: "",
    status: "PENDING", openedDaysAgo: 4, hours: HOURS("06:00", "21:00", false),
    services: ["Custom cakes", "Wholesale"], products: ["Sourdough", "Butter croissants", "Birthday cakes"], purchased: 500,
    promotions: [
      ["Fresh bread after 7 pm", "DEAL", "PUBLISHED", "Half price", "All unsold bread and pastries are half price after 7 pm, every day.", -6, null, "Food", { popularity: 7 }],
      ["Birthday cake preview", "PRODUCT", "DRAFT", "", "", 0, null, "", {}],
    ],
  },
  {
    key: "summit-sports",
    name: "Summit Sports",
    tagline: "Gear for the trail and the pitch",
    description: "Boots, jackets, packs and team kit. Staff who actually hike will help you choose.",
    town: "Olakha", dzongkhag: "Thimphu", line1: "Olakha", phone: "+97517100106", website: "https://summitsports.example.bt",
    status: "VERIFIED", openedDaysAgo: 220, hours: HOURS("09:00", "18:30"),
    services: ["Boot fitting", "Team orders"], products: ["Hiking boots", "Rain jackets", "Football kit"], purchased: 500,
    promotions: [
      ["Hiking boots & jackets", "SALE", "PUBLISHED", "30% off", "Get ready for trekking season: 30% off selected boots and jackets.", -9, 4, "Home", { popularity: 6 }],
      ["Family football day", "EVENT", "PUBLISHED", "Free entry", "Bring the family for matches, relay races and a picnic on the ground. All ages welcome.", 14, 14, "Kids", { popularity: 5 }],
    ],
  },
  {
    key: "thimphu-roast",
    name: "Thimphu Roast",
    tagline: "Small-batch coffee, big conversations",
    description: "Specialty coffee roasted in Changzamtog. Pour-overs, espresso and a cake counter you will regret ignoring.",
    town: "Changzamtog", dzongkhag: "Thimphu", line1: "Changzamtog", phone: "+97517100107", website: "https://thimphuroast.example.bt",
    status: "VERIFIED", openedDaysAgo: 14, hours: HOURS("08:00", "21:00", false),
    services: ["Dine-in", "Takeaway", "Beans to go"], products: ["Espresso", "Pour-over", "Cakes"], purchased: 1000,
    promotions: [
      ["Coffee & cake combo", "DEAL", "PUBLISHED", "Nu. 250", "Any coffee with a slice of the cake of the day for Nu. 250. Today only.", 0, 0, "Cafés", { popularity: 9 }],
      ["Free first tasting flight", "DEAL", "PUBLISHED", "Free tasting", "Try our three-coffee tasting flight on your first visit, on us.", -13, 10, "Cafés", { popularity: 6 }],
      ["Acoustic open mic", "EVENT", "PUBLISHED", "Free entry", "Bring a guitar or just a song. Sign up at the counter from 6 pm.", 21, 21, "Events", { popularity: 4 }],
    ],
  },
  {
    key: "paro-valley-homestay",
    name: "Paro Valley Homestay",
    tagline: "Farmhouse stay with a view of the valley",
    description: "Stay with a Paro family in a traditional farmhouse. Home-cooked dinners, hot stone baths and a short walk to the river.",
    town: "Paro town", dzongkhag: "Paro", line1: "Bondey, Paro", phone: "+97517100108", website: "https://parovalley.example.bt",
    status: "VERIFIED", openedDaysAgo: 60, hours: HOURS("08:00", "20:00", false),
    services: ["Home-cooked meals", "Airport pickup", "Guided walks"], products: ["Farmhouse rooms"], purchased: 500,
    promotions: [
      ["Stay two nights, third night free", "DEAL", "PUBLISHED", "3rd night free", "Book two nights this month and the third is on us. Breakfast included.", -7, 25, "Stays", { popularity: 6 }],
      ["Traditional dance showcase", "EVENT", "PUBLISHED", "Nu. 300", "An evening of mask and folk dances by local performers, with dinner available.", 18, 18, "Festival", { popularity: 5 }],
    ],
  },
  {
    key: "thimphu-events-hub",
    name: "Thimphu Events Hub",
    tagline: "What's on in the capital",
    description: "We organise markets, fairs and workshops around Thimphu, and bring local makers and cooks together.",
    town: "Clock Tower", dzongkhag: "Thimphu", line1: "Clock Tower Square", phone: "+97517100109", website: "https://thimphuevents.example.bt",
    status: "VERIFIED", openedDaysAgo: 400, hours: HOURS("09:00", "17:00"),
    services: ["Event organising", "Stall booking"], products: [], purchased: 1500,
    promotions: [
      ["Festival night market", "EVENT", "PUBLISHED", "Free entry", "Food, crafts and live music in the town centre. Dozens of stalls, open until late.", 6, 6, "Festival", { popularity: 10 }],
      ["Live music evening", "EVENT", "PUBLISHED", "Nu. 300", "Three local bands, one stage. Tickets at the gate or in advance.", 3, 3, "Events", { popularity: 7 }],
      ["Archery open day", "EVENT", "PUBLISHED", "Free entry", "Try Bhutan's national sport with coaches on hand. All ages, no experience needed.", 1, 1, "Events", { popularity: 5 }],
      ["Crafts fair", "EVENT", "PUBLISHED", "Free entry", "Woodwork, weaving, jewellery and paintings from makers across the country.", 11, 12, "Events", { popularity: 6 }],
      ["Kids' painting workshop", "EVENT", "PUBLISHED", "Nu. 200", "A morning of painting for ages 6 to 12. Materials provided.", 20, 20, "Kids", { popularity: 4 }],
      ["Food festival", "EVENT", "PUBLISHED", "Free entry", "Regional dishes from every dzongkhag, cooked by the people who grew up eating them.", 24, 24, "Festival", { popularity: 6 }],
      ["Thangka painting class", "EVENT", "PUBLISHED", "Nu. 800", "A beginner-friendly afternoon with a master painter. All materials included.", 30, 30, "Events", { popularity: 3 }],
    ],
  },
];

export const CUSTOMERS = [
  ["Pema Dorji", "Thimphu"], ["Tshering Wangmo", "Thimphu"], ["Karma Choden", "Paro"], ["Sonam Tenzin", "Thimphu"],
  ["Dechen Lhamo", "Punakha"], ["Ugyen Phuntsho", "Thimphu"], ["Kinley Zangmo", "Thimphu"], ["Jigme Namgyal", "Paro"],
  ["Choki Dema", "Chhukha"], ["Tandin Wangchuk", "Thimphu"], ["Yeshey Pelden", "Bumthang"], ["Sangay Choden", "Thimphu"],
  ["Nima Lhamo", "Thimphu"], ["Rinchen Gyeltshen", "Wangdue Phodrang"],
];

export const SOURCE_WEIGHTS = [["home", 28], ["discover", 22], ["deals", 20], ["events", 12], ["search", 12], ["other", 6]];
