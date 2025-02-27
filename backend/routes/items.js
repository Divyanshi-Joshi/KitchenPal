const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await Item.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new item
router.post('/:userId', async (req, res) => {
  const item = new Item({
    ...req.body,
    userId: req.params.userId
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item
router.put('/:userId/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ 
      _id: req.params.id,
      userId: req.params.userId 
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    Object.assign(item, req.body);
    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete item
router.delete('/:userId/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ 
      _id: req.params.id,
      userId: req.params.userId 
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;