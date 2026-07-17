import dotenv from "dotenv";
import Question from "../models/Question.js";
import connectDB from "../config/db.js";

dotenv.config();

connectDB();

const animeQuestions = [
  // ONE PIECE QUESTIONS
  {
    question: "What is Monkey D. Luffy's main dream?",
    options: [
      { text: "To become the strongest swordsman" },
      { text: "To become the Pirate King" },
      { text: "To become a Marine admiral" },
      { text: "To find all Devil Fruits" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "Luffy's dream is to become the Pirate King.",
  },
  {
    question: "What power does Luffy's Devil Fruit originally give him?",
    options: [
      { text: "Fire powers" },
      { text: "Ice powers" },
      { text: "Rubber-like body" },
      { text: "Lightning powers" },
    ],
    correctOptionIndex: 2,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation:
      "Luffy's body becomes rubber-like after eating his Devil Fruit.",
  },
  {
    question: "Who is the swordsman of the Straw Hat Pirates?",
    options: [
      { text: "Sanji" },
      { text: "Usopp" },
      { text: "Roronoa Zoro" },
      { text: "Franky" },
    ],
    correctOptionIndex: 2,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "Roronoa Zoro is the swordsman of the Straw Hat Pirates.",
  },
  {
    question: "What is Nami's role in the Straw Hat Pirates?",
    options: [
      { text: "Doctor" },
      { text: "Navigator" },
      { text: "Cook" },
      { text: "Shipwright" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "Nami is the navigator of the Straw Hat Pirates.",
  },
  {
    question: "Who is the cook of the Straw Hat Pirates?",
    options: [
      { text: "Sanji" },
      { text: "Zoro" },
      { text: "Brook" },
      { text: "Jinbe" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "Sanji is the cook of the Straw Hat Pirates.",
  },
  {
    question: "What is the name of the treasure that many pirates search for?",
    options: [
      { text: "Dragon Ball" },
      { text: "One Piece" },
      { text: "Soul Society" },
      { text: "Sharingan" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "The legendary treasure is called the One Piece.",
  },
  {
    question: "Who gave Luffy his straw hat?",
    options: [
      { text: "Gol D. Roger" },
      { text: "Shanks" },
      { text: "Ace" },
      { text: "Garp" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "Shanks gave Luffy the straw hat.",
  },
  {
    question: "What is Tony Tony Chopper's role in the crew?",
    options: [
      { text: "Doctor" },
      { text: "Sniper" },
      { text: "Musician" },
      { text: "Navigator" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "Chopper is the doctor of the Straw Hat Pirates.",
  },
  {
    question: "Which member of the Straw Hat Pirates uses three-sword style?",
    options: [
      { text: "Brook" },
      { text: "Sanji" },
      { text: "Zoro" },
      { text: "Franky" },
    ],
    correctOptionIndex: 2,
    category: "anime",
    franchise: "one-piece",
    difficulty: "medium",
    explanation: "Zoro uses Santoryu, also known as three-sword style.",
  },
  {
    question: "What organization mainly opposes pirates in One Piece?",
    options: [
      { text: "The Marines" },
      { text: "The Akatsuki" },
      { text: "The Soul Reapers" },
      { text: "The Survey Corps" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "one-piece",
    difficulty: "easy",
    explanation: "The Marines are the main military force opposing pirates.",
  },

  // NARUTO QUESTIONS
  {
    question: "What is Naruto Uzumaki's dream?",
    options: [
      { text: "To become Hokage" },
      { text: "To become Pirate King" },
      { text: "To become a Soul Reaper" },
      { text: "To become a Saiyan" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Naruto dreams of becoming Hokage.",
  },
  {
    question: "Which village is Naruto from?",
    options: [
      { text: "Hidden Sand Village" },
      { text: "Hidden Leaf Village" },
      { text: "Hidden Mist Village" },
      { text: "Hidden Cloud Village" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Naruto is from Konohagakure, the Hidden Leaf Village.",
  },
  {
    question: "Who is Naruto's main rival?",
    options: [
      { text: "Kakashi Hatake" },
      { text: "Sasuke Uchiha" },
      { text: "Shikamaru Nara" },
      { text: "Jiraiya" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Sasuke Uchiha is Naruto's main rival.",
  },
  {
    question: "Who is the teacher of Team 7?",
    options: [
      { text: "Might Guy" },
      { text: "Iruka Umino" },
      { text: "Kakashi Hatake" },
      { text: "Asuma Sarutobi" },
    ],
    correctOptionIndex: 2,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Kakashi Hatake is the leader and teacher of Team 7.",
  },
  {
    question: "Which clan is famous for the Sharingan?",
    options: [
      { text: "Hyuga Clan" },
      { text: "Uchiha Clan" },
      { text: "Nara Clan" },
      { text: "Akimichi Clan" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "The Uchiha Clan is known for the Sharingan.",
  },
  {
    question: "What is Naruto's signature jutsu?",
    options: [
      { text: "Chidori" },
      { text: "Rasengan" },
      { text: "Fireball Jutsu" },
      { text: "Shadow Possession" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Rasengan is one of Naruto's signature techniques.",
  },
  {
    question: "Who is Sakura Haruno's teacher during Shippuden?",
    options: [
      { text: "Tsunade" },
      { text: "Kurenai" },
      { text: "Mei Terumi" },
      { text: "Anko" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "naruto",
    difficulty: "medium",
    explanation: "Sakura trains under Tsunade during Shippuden.",
  },
  {
    question: "Which tailed beast is sealed inside Naruto?",
    options: [
      { text: "One-Tails" },
      { text: "Eight-Tails" },
      { text: "Nine-Tails" },
      { text: "Three-Tails" },
    ],
    correctOptionIndex: 2,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Kurama, the Nine-Tails, is sealed inside Naruto.",
  },
  {
    question: "Who is known as the Copy Ninja?",
    options: [
      { text: "Kakashi Hatake" },
      { text: "Minato Namikaze" },
      { text: "Itachi Uchiha" },
      { text: "Madara Uchiha" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "naruto",
    difficulty: "easy",
    explanation: "Kakashi is known as the Copy Ninja because of his Sharingan.",
  },
  {
    question: "What is the name of the group that hunts tailed beasts?",
    options: [
      { text: "Akatsuki" },
      { text: "Espada" },
      { text: "Marines" },
      { text: "Phantom Troupe" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "naruto",
    difficulty: "medium",
    explanation: "The Akatsuki hunts tailed beasts.",
  },

  // BLEACH QUESTIONS
  {
    question: "Who is the main character of Bleach?",
    options: [
      { text: "Ichigo Kurosaki" },
      { text: "Naruto Uzumaki" },
      { text: "Monkey D. Luffy" },
      { text: "Eren Yeager" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "bleach",
    difficulty: "easy",
    explanation: "Ichigo Kurosaki is the main character of Bleach.",
  },
  {
    question: "What type of beings do Soul Reapers mainly fight?",
    options: [
      { text: "Titans" },
      { text: "Hollows" },
      { text: "Pirates" },
      { text: "Ninjas" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "bleach",
    difficulty: "easy",
    explanation: "Soul Reapers mainly fight Hollows.",
  },
  {
    question: "Who gives Ichigo Soul Reaper powers at the beginning?",
    options: [
      { text: "Orihime Inoue" },
      { text: "Rukia Kuchiki" },
      { text: "Yoruichi Shihouin" },
      { text: "Rangiku Matsumoto" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "bleach",
    difficulty: "easy",
    explanation: "Rukia Kuchiki transfers her powers to Ichigo at the start.",
  },
  {
    question: "What is the name of Ichigo's Zanpakuto?",
    options: [
      { text: "Senbonzakura" },
      { text: "Zangetsu" },
      { text: "Hyōrinmaru" },
      { text: "Sode no Shirayuki" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "bleach",
    difficulty: "medium",
    explanation: "Ichigo's Zanpakuto is named Zangetsu.",
  },
  {
    question: "What is the organization of Soul Reapers called?",
    options: [
      { text: "Soul Society" },
      { text: "Hidden Leaf" },
      { text: "Grand Line" },
      { text: "Akatsuki" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "bleach",
    difficulty: "easy",
    explanation:
      "Soul Society is the world and organization associated with Soul Reapers.",
  },
  {
    question: "Who is Rukia's older brother?",
    options: [
      { text: "Renji Abarai" },
      { text: "Byakuya Kuchiki" },
      { text: "Toshiro Hitsugaya" },
      { text: "Kenpachi Zaraki" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "bleach",
    difficulty: "medium",
    explanation: "Byakuya Kuchiki is Rukia's older adoptive brother.",
  },
  {
    question:
      "Who is Ichigo's close friend with spiritual awareness and strong arms?",
    options: [
      { text: "Uryu Ishida" },
      { text: "Yasutora Sado" },
      { text: "Kon" },
      { text: "Aizen" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "bleach",
    difficulty: "medium",
    explanation: "Yasutora Sado, also called Chad, is Ichigo's close friend.",
  },
  {
    question: "Which character is a Quincy?",
    options: [
      { text: "Uryu Ishida" },
      { text: "Renji Abarai" },
      { text: "Rukia Kuchiki" },
      { text: "Orihime Inoue" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "bleach",
    difficulty: "medium",
    explanation: "Uryu Ishida is a Quincy.",
  },
  {
    question: "What is the released form of a Zanpakuto usually called?",
    options: [
      { text: "Rasengan" },
      { text: "Shikai" },
      { text: "Gear Second" },
      { text: "Sharingan" },
    ],
    correctOptionIndex: 1,
    category: "anime",
    franchise: "bleach",
    difficulty: "medium",
    explanation: "Shikai is the initial released form of a Zanpakuto.",
  },
  {
    question:
      "Who is the captain known for having a childlike appearance and ice powers?",
    options: [
      { text: "Toshiro Hitsugaya" },
      { text: "Shunsui Kyoraku" },
      { text: "Mayuri Kurotsuchi" },
      { text: "Sajin Komamura" },
    ],
    correctOptionIndex: 0,
    category: "anime",
    franchise: "bleach",
    difficulty: "medium",
    explanation: "Toshiro Hitsugaya is known for his ice-type Zanpakuto.",
  },
];

const sportsQuestions = [
  {
    question: "How many players are on a standard soccer team on the field?",
    options: [{ text: "9" }, { text: "10" }, { text: "11" }, { text: "12" }],
    correctOptionIndex: 2,
    category: "sports",
    difficulty: "easy",
    explanation: "A standard soccer team has 11 players on the field.",
  },
  {
    question: "In tennis, what is a score of zero called?",
    options: [{ text: "Nil" }, { text: "Zero" }, { text: "Love" }, { text: "Nothing" }],
    correctOptionIndex: 2,
    category: "sports",
    difficulty: "easy",
    explanation: "In tennis, zero is called 'Love'.",
  },
  {
    question: "How long is a marathon?",
    options: [{ text: "13.1 miles" }, { text: "26.2 miles" }, { text: "20 miles" }, { text: "100 km" }],
    correctOptionIndex: 1,
    category: "sports",
    difficulty: "medium",
    explanation: "A marathon is exactly 26.2 miles long.",
  },
  {
    question: "Which sport is known as the 'gentleman's game'?",
    options: [{ text: "Golf" }, { text: "Cricket" }, { text: "Tennis" }, { text: "Polo" }],
    correctOptionIndex: 1,
    category: "sports",
    difficulty: "medium",
    explanation: "Cricket is traditionally known as the gentleman's game.",
  },
  {
    question: "How many rings are there on the Olympic flag?",
    options: [{ text: "4" }, { text: "5" }, { text: "6" }, { text: "7" }],
    correctOptionIndex: 1,
    category: "sports",
    difficulty: "easy",
    explanation: "The Olympic flag has 5 rings.",
  },
  {
    question: "In which sport would you perform a slam dunk?",
    options: [{ text: "Volleyball" }, { text: "Basketball" }, { text: "Tennis" }, { text: "Rugby" }],
    correctOptionIndex: 1,
    category: "sports",
    difficulty: "easy",
    explanation: "A slam dunk is a scoring move in basketball.",
  },
  {
    question: "What is the national sport of Canada?",
    options: [{ text: "Ice Hockey" }, { text: "Lacrosse" }, { text: "Both Ice Hockey and Lacrosse" }, { text: "Curling" }],
    correctOptionIndex: 2,
    category: "sports",
    difficulty: "medium",
    explanation: "Canada has two national sports: Ice Hockey (winter) and Lacrosse (summer).",
  },
  {
    question: "Who holds the record for the most Olympic gold medals?",
    options: [{ text: "Usain Bolt" }, { text: "Michael Phelps" }, { text: "Carl Lewis" }, { text: "Mark Spitz" }],
    correctOptionIndex: 1,
    category: "sports",
    difficulty: "medium",
    explanation: "Michael Phelps holds the record with 23 gold medals.",
  },
  {
    question: "In baseball, how many strikes make an out?",
    options: [{ text: "2" }, { text: "3" }, { text: "4" }, { text: "5" }],
    correctOptionIndex: 1,
    category: "sports",
    difficulty: "easy",
    explanation: "Three strikes make an out.",
  },
  {
    question: "What sport uses a shuttlecock?",
    options: [{ text: "Table Tennis" }, { text: "Squash" }, { text: "Badminton" }, { text: "Tennis" }],
    correctOptionIndex: 2,
    category: "sports",
    difficulty: "easy",
    explanation: "Badminton is played with a shuttlecock.",
  }
];

const geographyQuestions = [
  {
    question: "What is the capital of France?",
    options: [{ text: "Berlin" }, { text: "Madrid" }, { text: "Rome" }, { text: "Paris" }],
    correctOptionIndex: 3,
    category: "geography",
    difficulty: "easy",
    explanation: "Paris is the capital of France.",
  },
  {
    question: "Which is the largest ocean on Earth?",
    options: [{ text: "Atlantic Ocean" }, { text: "Indian Ocean" }, { text: "Pacific Ocean" }, { text: "Arctic Ocean" }],
    correctOptionIndex: 2,
    category: "geography",
    difficulty: "easy",
    explanation: "The Pacific Ocean is the largest ocean.",
  },
  {
    question: "What is the longest river in the world?",
    options: [{ text: "Amazon River" }, { text: "Nile River" }, { text: "Yangtze River" }, { text: "Mississippi River" }],
    correctOptionIndex: 1,
    category: "geography",
    difficulty: "medium",
    explanation: "The Nile River is traditionally considered the longest.",
  },
  {
    question: "Which country has the largest land area?",
    options: [{ text: "Canada" }, { text: "China" }, { text: "United States" }, { text: "Russia" }],
    correctOptionIndex: 3,
    category: "geography",
    difficulty: "easy",
    explanation: "Russia is the largest country by land area.",
  },
  {
    question: "Mount Everest is located in which mountain range?",
    options: [{ text: "Andes" }, { text: "Alps" }, { text: "Himalayas" }, { text: "Rockies" }],
    correctOptionIndex: 2,
    category: "geography",
    difficulty: "easy",
    explanation: "Mount Everest is in the Himalayas.",
  },
  {
    question: "What is the smallest country in the world?",
    options: [{ text: "Monaco" }, { text: "Vatican City" }, { text: "San Marino" }, { text: "Liechtenstein" }],
    correctOptionIndex: 1,
    category: "geography",
    difficulty: "medium",
    explanation: "Vatican City is the smallest country.",
  },
  {
    question: "Which desert is the largest hot desert in the world?",
    options: [{ text: "Gobi" }, { text: "Kalahari" }, { text: "Sahara" }, { text: "Mojave" }],
    correctOptionIndex: 2,
    category: "geography",
    difficulty: "easy",
    explanation: "The Sahara is the largest hot desert.",
  },
  {
    question: "What is the capital of Japan?",
    options: [{ text: "Kyoto" }, { text: "Osaka" }, { text: "Tokyo" }, { text: "Seoul" }],
    correctOptionIndex: 2,
    category: "geography",
    difficulty: "easy",
    explanation: "Tokyo is the capital of Japan.",
  },
  {
    question: "How many continents are there?",
    options: [{ text: "5" }, { text: "6" }, { text: "7" }, { text: "8" }],
    correctOptionIndex: 2,
    category: "geography",
    difficulty: "easy",
    explanation: "There are 7 continents.",
  },
  {
    question: "Which river flows through London?",
    options: [{ text: "Seine" }, { text: "Rhine" }, { text: "Danube" }, { text: "Thames" }],
    correctOptionIndex: 3,
    category: "geography",
    difficulty: "medium",
    explanation: "The Thames River flows through London.",
  }
];

const generalKnowledgeQuestions = [
  {
    question: "What is the chemical symbol for water?",
    options: [{ text: "O2" }, { text: "H2O" }, { text: "CO2" }, { text: "NaCl" }],
    correctOptionIndex: 1,
    category: "general-knowledge",
    difficulty: "easy",
    explanation: "H2O is the chemical symbol for water.",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [{ text: "Charles Dickens" }, { text: "William Shakespeare" }, { text: "Mark Twain" }, { text: "Jane Austen" }],
    correctOptionIndex: 1,
    category: "general-knowledge",
    difficulty: "easy",
    explanation: "William Shakespeare wrote 'Romeo and Juliet'.",
  },
  {
    question: "What is the freezing point of water in Celsius?",
    options: [{ text: "0°C" }, { text: "32°C" }, { text: "100°C" }, { text: "-10°C" }],
    correctOptionIndex: 0,
    category: "general-knowledge",
    difficulty: "easy",
    explanation: "Water freezes at 0 degrees Celsius.",
  },
  {
    question: "How many planets are in our solar system?",
    options: [{ text: "7" }, { text: "8" }, { text: "9" }, { text: "10" }],
    correctOptionIndex: 1,
    category: "general-knowledge",
    difficulty: "easy",
    explanation: "There are 8 planets in our solar system.",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [{ text: "Vincent van Gogh" }, { text: "Pablo Picasso" }, { text: "Leonardo da Vinci" }, { text: "Michelangelo" }],
    correctOptionIndex: 2,
    category: "general-knowledge",
    difficulty: "easy",
    explanation: "Leonardo da Vinci painted the Mona Lisa.",
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: [{ text: "Gold" }, { text: "Iron" }, { text: "Diamond" }, { text: "Quartz" }],
    correctOptionIndex: 2,
    category: "general-knowledge",
    difficulty: "medium",
    explanation: "Diamond is the hardest natural substance.",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: [{ text: "Osmium" }, { text: "Oxygen" }, { text: "Gold" }, { text: "Silver" }],
    correctOptionIndex: 1,
    category: "general-knowledge",
    difficulty: "easy",
    explanation: "Oxygen's chemical symbol is 'O'.",
  },
  {
    question: "In what year did the Titanic sink?",
    options: [{ text: "1912" }, { text: "1905" }, { text: "1920" }, { text: "1898" }],
    correctOptionIndex: 0,
    category: "general-knowledge",
    difficulty: "medium",
    explanation: "The Titanic sank in 1912.",
  },
  {
    question: "What is the largest organ in the human body?",
    options: [{ text: "Heart" }, { text: "Liver" }, { text: "Brain" }, { text: "Skin" }],
    correctOptionIndex: 3,
    category: "general-knowledge",
    difficulty: "medium",
    explanation: "The skin is the largest organ.",
  },
  {
    question: "What language has the most native speakers?",
    options: [{ text: "English" }, { text: "Spanish" }, { text: "Mandarin Chinese" }, { text: "Hindi" }],
    correctOptionIndex: 2,
    category: "general-knowledge",
    difficulty: "medium",
    explanation: "Mandarin Chinese has the most native speakers.",
  }
];


const seedQuestions = async () => {
  try {
    // Delete old questions before inserting fresh data.
    await Question.deleteMany({});

    // Insert all questions into MongoDB.
    await Question.insertMany([
      ...animeQuestions,
      ...sportsQuestions,
      ...geographyQuestions,
      ...generalKnowledgeQuestions
    ]);

    console.log("Questions inserted successfully");
    process.exit();
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedQuestions();
