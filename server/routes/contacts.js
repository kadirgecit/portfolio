const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Submit contact form (public)
router.post('/submit', [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('subject').notEmpty().trim().escape(),
  body('message').notEmpty().trim().escape()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await prisma.contact.create({
      data: req.body
    });

    res.status(201).json({ 
      message: 'Message sent successfully!',
      id: contact.id 
    });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get all contacts (admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.contact.count({ where })
    ]);

    res.json({
      contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single contact
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id: req.params.id }
    });
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update contact status
router.patch('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['unread', 'read', 'replied'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });

    res.json(contact);
  } catch (error) {
    console.error('Update contact status error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contact
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await prisma.contact.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact stats
router.get('/stats/overview', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [total, unread, read, replied] = await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { status: 'unread' } }),
      prisma.contact.count({ where: { status: 'read' } }),
      prisma.contact.count({ where: { status: 'replied' } })
    ]);

    res.json({
      total,
      unread,
      read,
      replied
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;