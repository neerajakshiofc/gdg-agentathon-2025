require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expenseRoutes');
const planRoutes = require('./routes/planRoutes');
const chatRoutes = require('./routes/chatRoutes');
const stocksRoutes = require('./routes/stocks'); // ✅ Fixed typo
const newsRoutes = require('./routes/news'); // ✅ Extracted
const agentRoutes = require('./routes/agentRoutes'); // ✅ Agentic AI Routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Auth routes are handled by authRoutes

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/expenses', expenseRoutes); // 👈 Better route separation
app.use('/api/plan', planRoutes);
app.use('/api/chat', chatRoutes);
app.use(stocksRoutes);
app.use('/', newsRoutes);
app.use('/api/agent', agentRoutes);

// JSON error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error("Bad JSON received:", err.message);
    return res.status(400).json({ message: "Invalid JSON" });
  }
  next();
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});