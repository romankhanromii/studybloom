import mongoose from 'mongoose';

const categoryStatsSchema = new mongoose.Schema({
  answered: { type: Number, default: 0 },
  correct: { type: Number, default: 0 }
}, { _id: false });

const weeklyPerformanceSchema = new mongoose.Schema({
  week: { type: String, required: true }, // Format: 'YYYY-WW'
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 }
}, { _id: false });

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  totalQuestionsAnswered: {
    type: Number,
    default: 0
  },
  totalCorrect: {
    type: Number,
    default: 0
  },
  totalIncorrect: {
    type: Number,
    default: 0
  },
  accuracyRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  totalStudyTime: {
    type: Number,
    default: 0, // seconds
    min: 0
  },
  categoryStats: {
    anatomic: categoryStatsSchema,
    clinical: categoryStatsSchema,
    forensic: categoryStatsSchema,
    cytopathology: categoryStatsSchema,
    'anatomic-clinical': categoryStatsSchema
  },
  weeklyPerformance: [weeklyPerformanceSchema]
}, {
  timestamps: true
});

// Method to update accuracy rate
userProgressSchema.methods.updateAccuracyRate = function() {
  if (this.totalQuestionsAnswered > 0) {
    this.accuracyRate = Math.round(
      (this.totalCorrect / this.totalQuestionsAnswered) * 100
    );
  } else {
    this.accuracyRate = 0;
  }
};

// Method to get current week string
userProgressSchema.statics.getCurrentWeek = function() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now - startOfYear) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-${weekNumber.toString().padStart(2, '0')}`;
};

const UserProgress = mongoose.model('UserProgress', userProgressSchema);

export default UserProgress;


