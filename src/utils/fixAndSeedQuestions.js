import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import { connectDB } from '../../config/db.js';

dotenv.config();

// Properly formatted questions matching the Question model schema
const questionsData = [
  {
    text: "What is the capital of Pakistan?",
    category: "anatomic",
    difficulty: "easy",
    diagram: false,
    options: [
      {
        text: "Karachi",
        explanation: "Karachi is the largest city but not the capital.",
        isCorrect: false
      },
      {
        text: "Lahore",
        explanation: "Lahore is a major cultural city but not the capital.",
        isCorrect: false
      },
      {
        text: "Islamabad",
        explanation: "Islamabad became the capital of Pakistan in 1967, replacing Karachi.",
        isCorrect: true
      },
      {
        text: "Rawalpindi",
        explanation: "Rawalpindi is a neighboring city but not the capital.",
        isCorrect: false
      }
    ],
    summary: "Islamabad is the capital and federal territory of Pakistan."
  },
  {
    text: "Who is known as the father of computers?",
    category: "clinical",
    difficulty: "easy",
    diagram: false,
    options: [
      {
        text: "Charles Babbage",
        explanation: "Charles Babbage designed the Analytical Engine, considered the first general-purpose computer.",
        isCorrect: true
      },
      {
        text: "Newton",
        explanation: "Newton was a physicist and mathematician, not the father of computers.",
        isCorrect: false
      },
      {
        text: "Einstein",
        explanation: "Einstein was a theoretical physicist, not related to computer development.",
        isCorrect: false
      },
      {
        text: "Tesla",
        explanation: "Tesla was an inventor and electrical engineer, but not the father of computers.",
        isCorrect: false
      }
    ],
    summary: "Charles Babbage is credited as the father of computers for his work on mechanical computing devices."
  },
  {
    text: "What does HTML stand for?",
    category: "anatomic",
    difficulty: "medium",
    diagram: false,
    options: [
      {
        text: "HyperText Markup Language",
        explanation: "HTML stands for HyperText Markup Language, the standard language for creating web pages.",
        isCorrect: true
      },
      {
        text: "HighText Machine Learning",
        explanation: "This is not what HTML stands for.",
        isCorrect: false
      },
      {
        text: "Hyper Transfer Machine Language",
        explanation: "This is incorrect. HTML is not related to machine language in this way.",
        isCorrect: false
      },
      {
        text: "None of the above",
        explanation: "HTML does stand for HyperText Markup Language.",
        isCorrect: false
      }
    ],
    summary: "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser."
  }
];

const fixAndSeedQuestions = async () => {
  try {
    // Connect to MongoDB using the db.js connection
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Clear existing questions with wrong format
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Insert questions with correct format
    const questions = await Question.insertMany(questionsData);
    console.log(`✅ Seeded ${questions.length} questions successfully`);

    // Get category counts
    const categoryCounts = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Questions by category:');
    categoryCounts.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} questions`);
    });

    console.log('\n✅ Database has been fixed and seeded with correctly formatted questions!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding questions:', error);
    process.exit(1);
  }
};

fixAndSeedQuestions();

