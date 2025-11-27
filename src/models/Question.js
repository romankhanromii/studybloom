import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
}, { _id: false });

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['anatomic', 'clinical', 'forensic', 'cytopathology', 'anatomic-clinical'],
    index: true
  },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.some(opt => opt.isCorrect === true);
      },
      message: 'Question must have at least 2 options and one correct answer'
    }
  },
  summary: {
    type: String,
    trim: true
  },
  diagram: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ category: 1, difficulty: 1 });

const Question = mongoose.model('Question', questionSchema);

export default Question;


