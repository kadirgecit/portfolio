const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../server/routes/auth');
const projectRoutes = require('../server/routes/projects');
const contactRoutes = require('../server/routes/contacts');
const { seedAdmin } = require('../server/utils/seed');

const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize admin user
let adminSeeded = false;
const initializeAdmin = async () => {
  if (!adminSeeded) {
    try {
      await seedAdmin();
      adminSeeded = true;
      console.log('✅ Admin user seeded successfully');
    } catch (error) {
      console.error('❌ Error seeding admin user:', error.message);
    }
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/contacts', contactRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Main handler for Vercel
module.exports = async (req, res) => {
  await initializeAdmin();
  return app(req, res);
};