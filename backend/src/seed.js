require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('./config/env');

const {
  User, Branch, Category, Product, Variant, Addon, Inventory, ChatbotKnowledge,
} = require('./models');

const pkr = (n) => n * 100;

// High quality unique images per category
const images = {
  'burgers': [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80',
    'https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80',
    'https://images.unsplash.com/photo-1594212202874-210b9f6e6a7f?w=800&q=80',
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80'
  ],
  'pizzas': [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80'
  ],
  'wings': [
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80',
    'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&q=80',
    'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80'
  ],
  'wraps-rolls': [
    'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&q=80',
    'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80'
  ],
  'bbq-grills': [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-831e3d36ea1a?w=800&q=80'
  ],
  'pasta': [
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80'
  ],
  'sides': [
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80',
    'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80',
    'https://images.unsplash.com/photo-1619535860434-cf9b902a0e8e?w=800&q=80'
  ],
  'breads': [
    'https://images.unsplash.com/photo-1619535860434-cf9b902a0e8e?w=800&q=80'
  ],
  'desserts': [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80'
  ],
  'shakes': [
    'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
    'https://images.unsplash.com/photo-1553787499-6f9133860278?w=800&q=80',
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80'
  ],
  'ice-cream': [
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80',
    'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800&q=80'
  ],
  'coffee-tea': [
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&q=80'
  ],
  'soups': [
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80'
  ],
  'drinks': [
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80'
  ],
  'rice': [
    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80'
  ]
};

let imgCounter = {};
const getImg = (cat) => {
  if (!imgCounter[cat]) imgCounter[cat] = 0;
  const list = images[cat] || ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'];
  const img = list[imgCounter[cat] % list.length];
  imgCounter[cat]++;
  return img;
};

const CATEGORIES = [
  { name: 'Burgers', slug: 'burgers', sortOrder: 1 },
  { name: 'Pizzas', slug: 'pizzas', sortOrder: 2 },
  { name: 'Wings', slug: 'wings', sortOrder: 3 },
  { name: 'Wraps & Rolls', slug: 'wraps-rolls', sortOrder: 4 },
  { name: 'BBQ & Grills', slug: 'bbq-grills', sortOrder: 5 },
  { name: 'Pasta', slug: 'pasta', sortOrder: 6 },
  { name: 'Sides', slug: 'sides', sortOrder: 7 },
  { name: 'Breads', slug: 'breads', sortOrder: 8 },
  { name: 'Desserts', slug: 'desserts', sortOrder: 9 },
  { name: 'Shakes', slug: 'shakes', sortOrder: 10 },
  { name: 'Ice Cream', slug: 'ice-cream', sortOrder: 11 },
  { name: 'Coffee & Tea', slug: 'coffee-tea', sortOrder: 12 },
  { name: 'Soups', slug: 'soups', sortOrder: 13 },
  { name: 'Drinks', slug: 'drinks', sortOrder: 14 },
  { name: 'Rice', slug: 'rice', sortOrder: 15 },
];

const ADDONS = [
  { name: 'Extra Chutney', price: pkr(30), type: 'SAUCE' },
  { name: 'Extra Chicken', price: pkr(120), type: 'TOPPING' },
  { name: 'Extra Cheese', price: pkr(120), type: 'TOPPING' },
  { name: 'Extra Onion', price: pkr(120), type: 'TOPPING' },
  { name: 'Extra Green Olive', price: pkr(120), type: 'TOPPING' },
  { name: 'Extra Black Olives', price: pkr(120), type: 'TOPPING' },
  { name: 'Extra Mushroom', price: pkr(120), type: 'TOPPING' },
];

const PRODUCTS = [
  // (Keep all the exact products you had from the previous seed, they are all here)
  { name: 'THE BRITTLE BURGER', desc: 'Zinger, Lettuce, Mayo, Cheese Slice, Special British Cheese Sauce', price: 580, cat: 'burgers' },
  { name: 'GRILL THRILL BURGER', desc: 'Grilled BBQ Marinated Fillet, Lettuce, Mayo, Cheese Slice, Special British Cheese Sauce', price: 640, cat: 'burgers' },
  { name: 'QUARTER POUNDER BURGER', desc: 'Grilled Minced Beef Patty, Lettuce, Mayo, Cheese Slice, Special British Cheese Sauce', price: 690, cat: 'burgers' },
  { name: 'CHICKEN STEAK BURGER', desc: 'Grilled Chicken Fillet, Lettuce, Mayo, Cheese Slice, Special British Cheese Slice, Sp Sauce', price: 690, cat: 'burgers' },
  { name: 'GRILLED FISH BURGER', desc: '', price: 670, cat: 'burgers' },
  { name: 'FISH ZINGER BURGER', desc: '', price: 670, cat: 'burgers' },
  { name: 'Beef Smash Burger', desc: '', price: 780, cat: 'burgers' },

  { name: 'Chicken Tikka Pizza', desc: 'Chicken Tikka, Red Sauce, Mozzarella Cheese, Onion', price: 860, cat: 'pizzas', isVIP: true },
  { name: 'Fajita Pizza', desc: 'Fajita Chicken, Red Sauce, Mozzarella Cheese, Onion, Capsicum', price: 860, cat: 'pizzas' },
  { name: 'Supreme Pizza', desc: 'Chicken Tikka, Fajita Chicken, Grilled Chicken, Red Sauce, Mozzarella Cheese, Onion, Capsicum, Mushroom, Black olives', price: 860, cat: 'pizzas', isVIP: true },
  { name: 'Hot & Spicy Pizza', desc: 'Fajita Chicken, Red Sauce, Mozzarella Cheese, Onion, Capsicum, Tomato, Jalapeno', price: 860, cat: 'pizzas' },
  { name: 'Chicken Lover Pizza', desc: 'Chicken Tikka, Red Sauce, Mozzarella Cheese, Onion, Capsicum', price: 860, cat: 'pizzas' },
  { name: 'Veggie Lover Pizza', desc: 'Red Sauce, Mozzarella Cheese, Onion, Capsicum, Tomato, Mushroom, Sweet Corn, Black Olives', price: 860, cat: 'pizzas' },
  { name: 'Cheese Lover Pizza', desc: 'Cheese & Cheese', price: 860, cat: 'pizzas' },
  { name: 'Fatayar Pizza', desc: '', price: 950, cat: 'pizzas' },
  { name: 'Black Cafe Special Pizza', desc: 'Two Types Chicken, British White Special Sauce, Onion, Capsicum, Mushroom, Black Olives, Cheese Served with Special British White Sauce', price: 900, cat: 'pizzas', isVIP: true },
  { name: 'The Ultimate BBQ Pizza', desc: 'British BBQ Sauce, Tikka, Mozzarella Cheese, Onion, Capsicum, Tomato, Black Olives, Mushroom', price: 900, cat: 'pizzas' },
  { name: 'Extreme Pizza', desc: 'Three Types Chicken, Onion, Capsicum, Mushrooms, Green Olives, Topped with Special White Sauce', price: 900, cat: 'pizzas' },
  { name: 'Bonfire Pizza', desc: 'Fajita chicken, Bonfire Sauce, Capsicum, Mushroom, Jalapeno', price: 900, cat: 'pizzas' },
  { name: 'Malai Boti Pizza', desc: 'Malai Boti, Green Olives, Mozzarella Cheese, Tomato, Topped with Special White Sauce', price: 900, cat: 'pizzas' },
  { name: 'Chicken Stuffed Pizza', desc: 'Stuffed with Tikka Chicken, British White Sauce, Onion, Tomato, Capsicum, Mushroom, Black Olives, Cheese, Topped with Special White Sauce', price: 1600, cat: 'pizzas', isVIP: true },
  { name: 'Cheese Stuffed Pizza', desc: 'Stuffed with Cheese, British White Sauce, Onion, Capsicum, Mushroom, Black Olives, Cheese', price: 1600, cat: 'pizzas' },
  { name: 'Kebab Stuffed Pizza', desc: 'Stuffed with Seekh Kabab, British White Sauce, Onion, Capsicum, Mushroom, Black Olives, Cheese', price: 1600, cat: 'pizzas' },
  { name: 'Crown Pizza', desc: 'British White Sauce, Mughlai Chicken, Onion, Capsicum, Black Olives, Mozzarella Cheese, Served with Special British White Sauce', price: 1600, cat: 'pizzas' },

  { name: 'OVEN BAKED WINGS', desc: '6 Pieces', price: 450, cat: 'wings' },
  { name: 'PERI PERI WINGS', desc: '', price: 460, cat: 'wings' },
  { name: 'CRISPY WINGS / HOT WINGS', desc: '', price: 450, cat: 'wings' },

  { name: 'LABANESE SHARARMA', desc: '', price: 350, cat: 'wraps-rolls' },
  { name: 'TWISTER ROLL', desc: '', price: 400, cat: 'wraps-rolls' },
  { name: 'SPRING ROLL', desc: '4 Pieces', price: 620, cat: 'wraps-rolls' },
  { name: 'Black Cafe Special Platter', desc: '', price: 1200, cat: 'wraps-rolls', isVIP: true },
  { name: 'ARABIC ROLL', desc: '', price: 620, cat: 'wraps-rolls' },
  { name: 'Chicken Tikka Paratha Roll', desc: 'Paratha (Tikka Boti pieces, Iceberg, Onions and Special British Mayo Sauce)', price: 420, cat: 'wraps-rolls' },
  { name: 'Malai Tikka Paratha Roll', desc: 'Paratha (Malai Tikka Boti pieces, Iceberg, Onions and Special British Mayo Sauce)', price: 440, cat: 'wraps-rolls' },
  { name: 'Green Tikka Paratha Roll', desc: 'Paratha (Green Tikka pieces, Iceberg, Onions and Special British Mayo Sauce)', price: 420, cat: 'wraps-rolls' },
  { name: 'Seekh kabab Paratha Roll', desc: '', price: 420, cat: 'wraps-rolls' },

  { name: 'London Fish & Chips', desc: '', price: 1100, cat: 'bbq-grills' },
  { name: 'Chicken Tikka Leg', desc: '1 piece', price: 380, cat: 'bbq-grills' },
  { name: 'Chicken Tikka Breast', desc: '1 Piece', price: 380, cat: 'bbq-grills' },
  { name: 'Chicken Tikka Boti', desc: '7 pieces', price: 480, cat: 'bbq-grills' },
  { name: 'Chicken Malai Boti', desc: '7 pieces', price: 500, cat: 'bbq-grills' },
  { name: 'Chicken Green Boti', desc: '7 pieces', price: 480, cat: 'bbq-grills' },
  { name: 'Beef Bihari Boti', desc: 'Spicy (10 pieces)', price: 500, cat: 'bbq-grills' },
  { name: 'Seekh Kabab', desc: '4 pieces', price: 480, cat: 'bbq-grills' },
  { name: 'Reshmi Kebab', desc: '4 pieces', price: 420, cat: 'bbq-grills' },
  { name: 'Koobideh', desc: 'Persian kebab with naan', price: 580, cat: 'bbq-grills' },
  { name: 'BBQ CHARCOAL FISH', desc: '', price: 1750, cat: 'bbq-grills', isVIP: true },
  { name: 'BBQ MIX GRILL 2 Persons', desc: '2 Reshmi Kebab, 2 Seekh Kabab, 2 Pieces Malai Boti, 2 Pieces Green Boti, 2 Pieces Tikka Boti', price: 1150, cat: 'bbq-grills' },
  { name: 'BBQ MIX GRILL 4 Persons', desc: '4 Reshmi Kebab, 4 Seekh Kabab, 4 Pieces Malai Boti, 4 Pieces Green Boti, 4 Pieces Tikka Boti', price: 2150, cat: 'bbq-grills' },
  { name: 'BBQ PLATTER HALF', desc: 'Rice (Afghani Pulao), Malai Boti, Chicken Tikka, Beef Bihari Boti, Chicken Kabab, Beef Kabab', price: 3500, cat: 'bbq-grills', isVIP: true },
  { name: 'BBQ PLATTER FULL', desc: '', price: 6800, cat: 'bbq-grills', isVIP: true },
  { name: 'BBQ FISH TIKKA WITH FRIES', desc: '', price: 1250, cat: 'bbq-grills' },
  { name: 'MUTTON CHOPS WITH FRIES', desc: '', price: 1150, cat: 'bbq-grills' },
  { name: 'CHICKEN BEHARI BOTI', desc: '6 PCS', price: 480, cat: 'bbq-grills' },
  { name: 'MEAT TIKKA BOTI', desc: '10 PCS', price: 850, cat: 'bbq-grills' },

  { name: 'BRITISH WHITE SAUCE PASTA', desc: '', price: 550, cat: 'pasta' },
  { name: 'BRITISH RED SAUCE PASTA', desc: '', price: 550, cat: 'pasta' },
  { name: 'British Crunchy Pasta', desc: '', price: 850, cat: 'pasta' },

  { name: 'NUGGET MEAL', desc: '', price: 450, cat: 'sides' },
  { name: 'PLAIN FRIES', desc: '', price: 320, cat: 'sides' },
  { name: 'PERI PERI FRIES', desc: '', price: 340, cat: 'sides' },
  { name: 'LOADED CHEESY FRIES', desc: '', price: 550, cat: 'sides', isVIP: true },
  { name: 'Special Pizza Fries', desc: '', price: 480, cat: 'sides' },
  { name: 'Cheese Sticks', desc: '', price: 560, cat: 'sides' },
  { name: 'Calzone Chunks', desc: '', price: 1050, cat: 'sides' },
  { name: 'Pizza Sandwich', desc: '', price: 850, cat: 'sides' },

  { name: 'Roghni Naan', desc: '', price: 90, cat: 'breads' },
  { name: 'WalWala Paratha', desc: '', price: 110, cat: 'breads' },
  { name: 'Chicken Paratha', desc: '', price: 280, cat: 'breads' },
  { name: 'Malai Paratha', desc: '', price: 220, cat: 'breads' },
  { name: 'Qeema Paratha', desc: '', price: 280, cat: 'breads' },

  { name: 'Choc O Lot', desc: 'Nutella - Topped with Sliced Banana/Strawberry', price: 750, cat: 'desserts' },
  { name: 'The Rocher', desc: 'Nutella - Topped with Sliced Banana/Strawberry with Oreo Sprinkles', price: 850, cat: 'desserts' },
  { name: 'Gelato Special', desc: 'Our Special', price: 950, cat: 'desserts', isVIP: true },
  { name: 'Children Story', desc: 'Nutella - Topped with Sliced Banana/Strawberry', price: 650, cat: 'desserts' },
  { name: 'Chocolate Volcano', desc: 'Nutella - Topped with Sliced Banana/Strawberry with Oreo Sprinkles', price: 750, cat: 'desserts', isVIP: true },
  { name: 'Choc Chip', desc: 'An indulgent blend of hot and chewy chocolate cookie dough served with Belgium chocolate, ice cream and topped with ice cream scoop of your own choice', price: 900, cat: 'desserts' },

  { name: 'FREAK SHAKE', desc: '', price: 580, cat: 'shakes' },
  { name: 'Nutella Shake', desc: 'Nutella', price: 470, cat: 'shakes' },
  { name: 'Nut Job', desc: 'Snickers', price: 490, cat: 'shakes' },
  { name: 'Pinacolada', desc: 'Pina Apple', price: 470, cat: 'shakes' },
  { name: 'White Collar', desc: 'Rafaello & Bounty Mix', price: 490, cat: 'shakes' },
  { name: 'Gelato Coffee Shake', desc: 'Double Shot Espresso Blend With Vanilla Ice Cream', price: 500, cat: 'shakes' },
  { name: 'Tik Talk Shake', desc: 'Kitkat', price: 490, cat: 'shakes' },
  { name: 'The Slim Shady', desc: 'M&Ms', price: 490, cat: 'shakes' },
  { name: 'About the Life', desc: 'Its a Ferrero Rocher Mystery', price: 750, cat: 'shakes', isVIP: true },
  { name: 'Oreocle', desc: 'Oreo', price: 430, cat: 'shakes' },
  { name: 'Chocolate Shake', desc: 'Chocolate Ice cream', price: 430, cat: 'shakes' },
  { name: 'Mango Shake', desc: 'Mango Ice Cream', price: 430, cat: 'shakes' },
  { name: 'Blueberry Shake', desc: 'Blue Berry Ice cream', price: 430, cat: 'shakes' },
  { name: 'Kulfa Shake', desc: 'Kulfa Ice Cream', price: 430, cat: 'shakes' },
  { name: 'Jammie Red Shake', desc: 'Strawberry', price: 430, cat: 'shakes' },
  { name: 'Pistacio Shake', desc: 'Pista Ice Cream', price: 430, cat: 'shakes' },
  { name: 'Mint Margarita', desc: '', price: 350, cat: 'shakes' },
  { name: 'Vanilla shake', desc: '', price: 380, cat: 'shakes' },

  { name: 'The Dark Side', desc: 'Nutella', price: 440, cat: 'ice-cream' },
  { name: 'Fruit Sundae', desc: 'Fruits', price: 400, cat: 'ice-cream' },
  { name: 'Cupid Arrow', desc: 'Chocolate', price: 400, cat: 'ice-cream' },
  { name: 'Banana Split', desc: 'Bananas', price: 360, cat: 'ice-cream' },
  { name: 'Black Panther', desc: 'Oreo', price: 420, cat: 'ice-cream' },
  { name: 'Smokey Ice Cream', desc: '', price: 420, cat: 'ice-cream' },
  { name: 'Small Ice Cream', desc: '', price: 90, cat: 'ice-cream' },
  { name: 'Medium Ice Cream', desc: '', price: 170, cat: 'ice-cream' },
  { name: 'Large Ice Cream', desc: '', price: 250, cat: 'ice-cream' },
  { name: 'HALF Ice Cream', desc: '', price: 500, cat: 'ice-cream' },
  { name: 'Full Ice Cream', desc: '', price: 990, cat: 'ice-cream' },

  { name: 'Cappucino', desc: '', price: 520, cat: 'coffee-tea' },
  { name: 'Cafe Latte', desc: '', price: 520, cat: 'coffee-tea' },
  { name: 'Affogato', desc: '', price: 380, cat: 'coffee-tea' },
  { name: 'Ice Latte', desc: '', price: 380, cat: 'coffee-tea' },
  { name: 'Green Tea', desc: '', price: 150, cat: 'coffee-tea' },
  { name: 'Cafe Americano Illy', desc: '', price: 390, cat: 'coffee-tea' },
  { name: 'Mocha Hot & Iced', desc: '', price: 540, cat: 'coffee-tea' },
  { name: 'Belgium Hot Chocolate', desc: '', price: 380, cat: 'coffee-tea' },
  { name: 'Karak Chai', desc: '', price: 200, cat: 'coffee-tea' },
  { name: 'English Breakfast Tea', desc: '', price: 150, cat: 'coffee-tea' },
  { name: 'Hot Milk', desc: '', price: 200, cat: 'coffee-tea' },
  { name: 'Espresso', desc: '', price: 380, cat: 'coffee-tea' },

  { name: 'Black cafe Special Soup', desc: '', price: 370, cat: 'soups' },
  { name: 'Hot & Sour Soup', desc: '', price: 370, cat: 'soups' },

  { name: 'Dragon Shots', desc: '', price: 300, cat: 'drinks' },
  { name: 'Coke 250ml', desc: '', price: 130, cat: 'drinks' },
  { name: 'Marinda 250ml', desc: '', price: 130, cat: 'drinks' },
  { name: '7Up 250ml', desc: '', price: 130, cat: 'drinks' },
  { name: 'Lemonade', desc: '', price: 220, cat: 'drinks' },
  { name: 'Coke (1LTR)', desc: '', price: 180, cat: 'drinks' },
  { name: 'Coke (1.5LTR)', desc: '', price: 230, cat: 'drinks' },
  { name: 'Water Small', desc: '', price: 70, cat: 'drinks' },
  { name: 'Water Large', desc: '', price: 100, cat: 'drinks' },
  { name: 'Sting can', desc: '', price: 130, cat: 'drinks' },

  { name: 'PLAIN RICE Half', desc: 'Half Plate', price: 550, cat: 'rice' },
  { name: 'PLAIN RICE Full', desc: 'Full Plate', price: 1100, cat: 'rice' },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(env.mongoUri);
  console.log('✅ Connected');

  console.log('🧹 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}), Branch.deleteMany({}), Category.deleteMany({}),
    Product.deleteMany({}), Variant.deleteMany({}), Addon.deleteMany({}),
    Inventory.deleteMany({}), ChatbotKnowledge.deleteMany({}),
  ]);

  console.log('👤 Creating admin user...');
  const adminHash = await bcrypt.hash('Admin@12345', 12);
  const admin = await User.create({
    name: 'Super Admin', email: 'admin@blackcafe.com', phone: '+92-300-0000000',
    passwordHash: adminHash, role: 'SUPER_ADMIN', isActive: true,
  });
  console.log(`   → admin@blackcafe.com  /  Admin@12345`);

  console.log('📂 Creating categories...');
  const categories = await Category.insertMany(CATEGORIES.map(c => ({...c, isActive: true})));
  const catBySlug = Object.fromEntries(categories.map(c => [c.slug, c]));

  console.log('🥫 Creating addons...');
  const addonDocs = await Addon.insertMany(ADDONS.map(a => ({...a, isActive: true})));

  console.log(`🍔 Creating ${PRODUCTS.length} products...`);
  const allProductIds = [];

  for (const def of PRODUCTS) {
    const product = await Product.create({
      name: def.name,
      slug: def.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: def.desc || 'Delicious item from Black Cafe',
      categoryId: catBySlug[def.cat]._id,
      images: [getImg(def.cat)], // Assigns a unique image from the array
      isVIP: def.isVIP || false,
      isFeatured: def.isVIP || false,
      preparationTime: 15,
      basePrice: pkr(def.price),
      isActive: true,
    });

    const variant = await Variant.create({
      productId: product._id, name: 'Regular', price: pkr(def.price), isActive: true
    });
    
    product.variantIds = [variant._id];
    if (['pizzas', 'burgers', 'sides'].includes(def.cat)) {
      product.addonIds = addonDocs.filter(a => a.name.includes('Cheese') || a.name.includes('Chicken') || a.name.includes('Chutney')).map(a => a._id);
    }

    await product.save();
    allProductIds.push(product._id);
  }

  console.log('🏪 Creating branches...');
  const branches = await Branch.insertMany([
    {
      name: 'Black Cafe — Main Branch', branchCode: 'PSH-01',
      address: 'Ring road main kabootar chowk peshawar',
      location: { type: 'Point', coordinates: [71.5249, 34.0151] },
      phone: '03710900074', openingHours: { open: '11:00', close: '02:45' },
      deliveryRadius: 10, deliveryFee: pkr(150), isActive: true, manager: admin._id
    }
  ]);

  console.log('📦 Creating inventory...');
  const inventoryDocs = [];
  for (const branch of branches) {
    for (const prodId of allProductIds) {
      inventoryDocs.push({
        branchId: branch._id, productId: prodId, availableQuantity: 100,
        reservedQuantity: 0, lowStockThreshold: 10, isAvailable: true,
      });
    }
  }
  await Inventory.insertMany(inventoryDocs);

  console.log('🤖 Creating chatbot knowledge...');
  await ChatbotKnowledge.insertMany([
    { question: 'What are your opening hours?', answer: 'We are open Monday to Sunday from 11:00 AM to 02:45 AM.', category: 'hours', isActive: true },
    { question: 'Do you deliver?', answer: 'Yes, we deliver within a 10km radius. Delivery fee is Rs. 150.', category: 'delivery', isActive: true },
    { question: 'What payment methods do you accept?', answer: 'We accept Easypaisa, JazzCash, Card, COD, and Cash at Pickup.', category: 'payments', isActive: true },
    { question: 'Can I cancel my order?', answer: 'Yes, you can cancel within 5 minutes for free.', category: 'orders', isActive: true },
  ]);

  console.log('\n✅ SEED COMPLETE');
  console.log('Admin: admin@blackcafe.com / Admin@12345');
  console.log(`Products: ${PRODUCTS.length}`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });