# Questions Format Fix

## Problem

Your database currently has questions in the wrong format:
- Uses `question` field instead of `text`
- Options are incorrectly formatted (character indices instead of proper option objects)
- Missing proper `options` structure with `text`, `explanation`, and `isCorrect` fields

## Solution

### 1. Fix JWT_SECRET Error

Make sure your `.env` file in the `backend` directory has:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 2. Fix Questions Format

Run the fix script to clear and reseed questions with correct format:

```bash
cd backend
npm run fix-questions
```

This will:
- Clear all existing questions
- Insert questions with correct format matching the Question model:
  - `text` field (not `question`)
  - `options` array with objects containing:
    - `text`: string
    - `explanation`: string  
    - `isCorrect`: boolean

### 3. Correct Question Format

```json
{
  "text": "What is the capital of Pakistan?",
  "category": "anatomic",
  "difficulty": "easy",
  "diagram": false,
  "options": [
    {
      "text": "Islamabad",
      "explanation": "Islamabad became the capital in 1967.",
      "isCorrect": true
    },
    {
      "text": "Karachi",
      "explanation": "Karachi is the largest city but not the capital.",
      "isCorrect": false
    }
  ],
  "summary": "Optional summary text"
}
```

### 4. Valid Categories

Questions must use one of these categories:
- `anatomic`
- `clinical`
- `forensic`
- `cytopathology`
- `anatomic-clinical`

### 5. Valid Difficulty Levels

- `easy`
- `medium`
- `hard`

## After Running the Fix

The frontend should now properly display:
- Question text correctly
- Options as selectable buttons with text (not character indices)
- Proper formatting and structure

