import express from 'express';
import {
  getStatsSummary,
  getPerformance,
  getCategoryStats
} from '../controllers/statsController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/summary', getStatsSummary);
router.get('/performance', getPerformance);
router.get('/category', getCategoryStats);

export default router;




