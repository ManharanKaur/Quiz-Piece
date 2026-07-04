import dotenv from "dotenv";
import Question from "../Models/Question.js";
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

const seedQuestions = async () => {
  try {
    // Delete old anime questions before inserting fresh data.
    // This prevents duplicate data when you run npm run seed again.
    await Question.deleteMany({ category: "anime" });

    // Insert all anime questions into MongoDB.
    await Question.insertMany(animeQuestions);

    console.log("Anime questions inserted successfully");
    process.exit();
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedQuestions();
