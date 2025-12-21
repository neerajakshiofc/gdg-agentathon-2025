const axios = require('axios');
const User = require('../models/User'); // Adjust path based on actual location
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
// Helper function to call Gemini API
const callGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No insights available.';
  } catch (err) {
    console.error('Gemini API Error:', err.response?.data || err.message);
    throw new Error('Failed to fetch AI insights.');
  }
};
// 1. Analyze Spending
exports.analyzeSpending = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const expenses = user.expenses;
    if (!expenses || expenses.length === 0) {
      return res.json({ analysis: 'No expenses found to analyze. Add some expenses to get insights!' });
    }
    // Prepare data for AI
    const expenseSummary = expenses.map(e => `${e.date ? new Date(e.date).toISOString().split('T')[0] : 'Unknown Date'}: ${e.title} - $${e.amount} (${e.category})`).join('\n');
    const prompt = `
      You are a financial advisor. Analyze the following user expenses and provide a concise report.
      Highlight overspending areas, potential savings, and practical recommendations.
      Be friendly and encouraging.
      
      Expenses:
      ${expenseSummary}
    `;
    const analysis = await callGemini(prompt);
    res.json({ analysis });
  } catch (err) {
    console.error(err);
    res.json({ analysis: `**[Note: AI Service Unavailable. Showing Demo Content]**\n\nBased on your recent activity, here are some general insights:\n1. Try to save 20% of your income.\n2. Review your subscriptions.\n3. Avoid impulse buying.` });
  }
};
// 2. Investment Guidance
exports.provideInvestmentGuidance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const plans = user.financialPlans || [];
    const planSummary = plans.map(p => `Goal: ${p.goal}, Target: $${p.targetAmount}, Current: $${p.currentAmount}, Deadline: ${p.deadline}`).join('\n');
    const prompt = `
      You are an expert investment planner.
      Based on the user's financial goals below, provide specific investment guidance.
      Explain SIP (Systematic Investment Plan) concepts if relevant, suggest asset allocation strategies (not specific stock tips, but logic), and long-term wealth habits.
      
      User Goals:
      ${planSummary.length > 0 ? planSummary : 'The user has not set specific goals yet. Provide general advice for a beginner investor.'}
    `;
    const guidance = await callGemini(prompt);
    res.json({ guidance });
  } catch (err) {
    console.error(err);
    res.json({ guidance: `**[Note: AI Service Unavailable. Showing Demo Content]**\n\n**Investment Strategy:**\n- Start a SIP in Nifty 50 Index Fund.\n- Allocate 50% to Equity, 30% to Debt, 20% to Gold.\n- Maintain an emergency fund of 6 months expenses.` });
  }
};
// 3. Weekly Financial Report
exports.generateWeeklyReport = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    // Filter expenses for the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentExpenses = user.expenses.filter(e => new Date(e.date) >= oneWeekAgo);
    const expenseSummary = recentExpenses.map(e => `${e.category}: $${e.amount}`).join('\n');
    const totalSpent = recentExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const prompt = `
      Generate a weekly financial report for a student.
      Total Spent this week: $${totalSpent}
      Breakdown:
      ${expenseSummary}
      
      Provide 3 key bullet points on how they managed their money this week and one tip for next week.
    `;
    const report = await callGemini(prompt);
    res.json({ report, totalSpent });
  } catch (err) {
    console.error(err);
    res.json({ report: `**[Note: AI Service Unavailable. Showing Demo Content]**\n\n**Weekly Summary:**\n- You spent within your budget.\n- High spending in Food category.\n- **Tip:** Cook at home to save $50 next week.`, totalSpent: 0 });
  }
};
// 4. Financial Knowledge (Bank/PAN Steps)
exports.getFinancialKnowledge = async (req, res) => {
  // We can use AI to keep this "up to date" or strictly defined static data.
  // Mixing both for best results.
  const prompt = `
      You are a helpful chat assistant.
      Provide a SUPER SHORT, conversational guide for a student in India.
      
      Topic:
      1. How to open a Savings Bank Account.
      2. How to apply for a PAN Card.

      Format Rules:
      - NO paragraphs.
      - Use ONLY bullet points.
      - Keep it under 100 words total.
      - Make it look like a quick chat message.
      
      Also provide 3 credible links.
    `;
  try {
    const knowledge = await callGemini(prompt);
    res.json({ content: knowledge });
  } catch (err) {
    // Fallback for knowledge if callGemini throws (though it shouldn't now)
    res.json({ content: "## Financial Steps (Offline Mode)\n1. **Bank Account**: Visit a branch with Aadhaar & PAN.\n2. **PAN Card**: Apply online at NSDL.\n**Links**: [RBI](https://rbi.org.in)" });
  }
};
