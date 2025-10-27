const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wiggy';

const funnyRestaurants = [
  {
    name: "McDonut's",
    description: "Fast food meets donut paradise - because why choose between breakfast and regret?",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop",
    cuisine: ["Fast Food", "Desserts"],
    rating: 4.2,
    deliveryTime: "15-25 mins",
    deliveryFee: 20,
    minimumOrder: 99,
    funnyTagline: "I'm lovin' it... until I check my calorie count!",
    address: {
      street: "123 Junk Food Lane",
      city: "Diabetesville",
      state: "Sugar Rush",
      zipCode: "12345"
    },
    menu: [
      {
        name: "Big McDonut",
        description: "A burger-sized donut that'll make you question your life choices",
        price: 149,
        image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop",
        category: "Main Course",
        isVeg: true,
        funnyDescription: "It's not a meal, it's a commitment to your sweet tooth!"
      },
      {
        name: "Fries with Extra Regret",
        description: "Golden fries that come with a side of 'Why did I order this?'",
        price: 89,
        image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=200&h=150&fit=crop",
        category: "Snacks",
        isVeg: true,
        funnyDescription: "Crispy on the outside, guilt on the inside!"
      },
      {
        name: "Shake of Shame",
        description: "A milkshake so good, you'll forget your lactose intolerance",
        price: 129,
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&h=150&fit=crop",
        category: "Beverages",
        isVeg: true,
        funnyDescription: "Thick enough to stand a spoon in, just like your excuses for ordering it!"
      },
      {
        name: "McSalad (Just Kidding)",
        description: "It's just lettuce with extra disappointment",
        price: 199,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop",
        category: "Main Course",
        isVeg: true,
        funnyDescription: "For when you want to lie to yourself about eating healthy!"
      }
    ]
  },
  {
    name: "Burger Singh",
    description: "Punjabi flavors meet American portions - where every meal is a celebration!",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop",
    cuisine: ["Indian", "Fast Food"],
    rating: 4.5,
    deliveryTime: "25-35 mins",
    deliveryFee: 25,
    minimumOrder: 150,
    funnyTagline: "Puttar, eat burger like a true Punjabi!",
    address: {
      street: "456 Tandoor Street",
      city: "New Delhi",
      state: "Punjab",
      zipCode: "67890"
    },
    menu: [
      {
        name: "Amritsari Burger",
        description: "A burger so good, it'll make you say 'Sat Sri Akal' to your diet",
        price: 199,
        category: "Main Course",
        isVeg: false,
        funnyDescription: "Blessed by the golden temple of flavor!"
      },
      {
        name: "Lassi Shake",
        description: "Traditional lassi meets modern confusion",
        price: 119,
        category: "Beverages",
        isVeg: true,
        funnyDescription: "Desi soul in a videsi bottle!"
      },
      {
        name: "Papad Pizza",
        description: "When Italian meets Indian and both are equally confused",
        price: 249,
        category: "Main Course",
        isVeg: true,
        funnyDescription: "Fusion food that'll confuse your taste buds in the best way!"
      },
      {
        name: "Samosa Fries",
        description: "Because regular fries are too mainstream",
        price: 149,
        category: "Snacks",
        isVeg: true,
        funnyDescription: "Crispy, spicy, and absolutely unnecessary - just like this description!"
      }
    ]
  },
  {
    name: "Pizza Hut? More like Pizza What!",
    description: "We're not affiliated with Pizza Hut, but we're definitely confused about pizza",
    cuisine: ["Italian", "Pizza"],
    rating: 3.8,
    deliveryTime: "30-45 mins",
    deliveryFee: 30,
    minimumOrder: 199,
    funnyTagline: "Pizza so confusing, even we don't know what we're serving!",
    address: {
      street: "789 Confusion Boulevard",
      city: "Whatville",
      state: "Pizza State",
      zipCode: "54321"
    },
    menu: [
      {
        name: "Existential Crisis Pizza",
        description: "A pizza that makes you question everything, including why you ordered it",
        price: 299,
        category: "Main Course",
        isVeg: true,
        funnyDescription: "Toppings chosen by a random number generator and pure chaos!"
      },
      {
        name: "Pineapple Controversy",
        description: "The pizza that started wars and ended friendships",
        price: 349,
        category: "Main Course",
        isVeg: true,
        funnyDescription: "Order this if you want to lose friends and influence people negatively!"
      },
      {
        name: "Garlic Bread Sticks",
        description: "Bread sticks that are somehow better than our pizza",
        price: 129,
        category: "Starters",
        isVeg: true,
        funnyDescription: "The only thing we consistently get right!"
      },
      {
        name: "Confused Cola",
        description: "Is it Coke? Is it Pepsi? Nobody knows!",
        price: 59,
        category: "Beverages",
        isVeg: true,
        funnyDescription: "The mystery drink that keeps you guessing!"
      }
    ]
  },
  {
    name: "Taco 'Bout Delicious",
    description: "Mexican food with puns so bad, they're good",
    cuisine: ["Mexican", "Fast Food"],
    rating: 4.3,
    deliveryTime: "20-30 mins",
    deliveryFee: 25,
    minimumOrder: 120,
    funnyTagline: "Nacho average Mexican restaurant!",
    address: {
      street: "321 Salsa Street",
      city: "Guacamole Gardens",
      state: "Mexicali",
      zipCode: "98765"
    },
    menu: [
      {
        name: "Holy Guacamole Bowl",
        description: "Guacamole so holy, it's been blessed by an avocado priest",
        price: 179,
        category: "Main Course",
        isVeg: true,
        funnyDescription: "Green, creamy, and spiritually enlightening!"
      },
      {
        name: "Nacho Problem Nachos",
        description: "Nachos that solve all your problems (temporarily)",
        price: 149,
        category: "Snacks",
        isVeg: true,
        funnyDescription: "Cheese therapy in edible form!"
      },
      {
        name: "Burrito of Broken Dreams",
        description: "A burrito stuffed with hopes, dreams, and way too much rice",
        price: 199,
        category: "Main Course",
        isVeg: false,
        funnyDescription: "Like your life - messy but somehow satisfying!"
      },
      {
        name: "Margarita (Virgin)",
        description: "All the fun of a margarita without the regret",
        price: 89,
        category: "Beverages",
        isVeg: true,
        funnyDescription: "For when you want to pretend you're fun but responsible!"
      }
    ]
  },
  {
    name: "Wok This Way",
    description: "Chinese food with attitude and questionable cooking techniques",
    cuisine: ["Chinese", "Asian"],
    rating: 4.1,
    deliveryTime: "25-40 mins",
    deliveryFee: 30,
    minimumOrder: 180,
    funnyTagline: "Wok on the wild side of flavor!",
    address: {
      street: "888 Fortune Cookie Lane",
      city: "Soy Sauce City",
      state: "Wonton",
      zipCode: "11111"
    },
    menu: [
      {
        name: "Sweet & Sour Life Lessons",
        description: "A dish that teaches you about life's ups and downs",
        price: 219,
        category: "Main Course",
        isVeg: false,
        funnyDescription: "Sweet like your expectations, sour like reality!"
      },
      {
        name: "Kung Pao Confusion",
        description: "Spicy chicken that's as confused about its identity as you are",
        price: 199,
        category: "Main Course",
        isVeg: false,
        funnyDescription: "Kicks harder than your Monday motivation!"
      },
      {
        name: "Fortune Cookie Wisdom",
        description: "Cookies that tell you things you already know",
        price: 79,
        category: "Desserts",
        isVeg: true,
        funnyDescription: "Crunchy wisdom for your soft problems!"
      },
      {
        name: "Jasmine Tea of Enlightenment",
        description: "Tea that promises wisdom but delivers caffeine",
        price: 69,
        category: "Beverages",
        isVeg: true,
        funnyDescription: "Hot leaf juice with existential benefits!"
      }
    ]
  },
  {
    name: "Curry in a Hurry",
    description: "Indian food for people who can't wait for flavor",
    cuisine: ["Indian", "Curry"],
    rating: 4.4,
    deliveryTime: "35-50 mins",
    deliveryFee: 35,
    minimumOrder: 200,
    funnyTagline: "Spice up your life, one curry at a time!",
    address: {
      street: "555 Spice Route",
      city: "Curry Corner",
      state: "Masala",
      zipCode: "22222"
    },
    menu: [
      {
        name: "Butter Chicken Therapy",
        description: "Chicken so good, it'll solve your emotional problems",
        price: 249,
        category: "Main Course",
        isVeg: false,
        funnyDescription: "Creamy, dreamy, and therapeutically delicious!"
      },
      {
        name: "Naan Sense",
        description: "Bread that makes perfect sense with everything",
        price: 89,
        category: "Starters",
        isVeg: true,
        funnyDescription: "Fluffy clouds of carbohydrate happiness!"
      },
      {
        name: "Dal-icious Lentils",
        description: "Lentils so good, we had to make a terrible pun",
        price: 169,
        category: "Main Course",
        isVeg: true,
        funnyDescription: "Protein-packed and pun-derfully tasty!"
      },
      {
        name: "Mango Lassi Dreams",
        description: "A drink that tastes like childhood summers",
        price: 99,
        category: "Beverages",
        isVeg: true,
        funnyDescription: "Sweet, creamy, and nostalgically perfect!"
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🎉 Connected to MongoDB!');

    // Clear existing restaurants
    await Restaurant.deleteMany({});
    console.log('🧹 Cleared existing restaurants');

    // Insert funny restaurants
    await Restaurant.insertMany(funnyRestaurants);
    console.log('🍽️ Added funny restaurants to database!');

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Added ${funnyRestaurants.length} restaurants with hilarious menus!`);
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();