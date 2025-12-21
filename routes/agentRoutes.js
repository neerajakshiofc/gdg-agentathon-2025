const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an auth middleware
// Protected routes (require login)
router.post('/spending-analysis', authMiddleware, agentController.analyzeSpending);
router.post('/investment-guidance', authMiddleware, agentController.provideInvestmentGuidance);
router.post('/weekly-report', authMiddleware, agentController.generateWeeklyReport);
// Public or Protected (depends on preference, making it protected for now to personalization if needed)
router.get('/knowledge', agentController.getFinancialKnowledge);
module.exports = router;