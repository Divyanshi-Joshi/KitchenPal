const express = require('express');
const router = express.Router();
const GroceryList = require('../models/GroceryList');

// Get current active list for a user
router.get('/:userId/current', async (req, res) => {
  try {
    const currentList = await GroceryList.findOne({ 
      userId: req.params.userId,
      status: 'active'
    }).sort({ createdAt: -1 });
    res.json(currentList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all lists for a user
router.get('/:userId', async (req, res) => {
  try {
    const lists = await GroceryList.find({ 
      userId: req.params.userId 
    }).sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new list
router.post('/:userId', async (req, res) => {
  const groceryList = new GroceryList({
    ...req.body,
    userId: req.params.userId
  });

  try {
    const newList = await groceryList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update list (for editing items and checking off items)
router.put('/:userId/:listId', async (req, res) => {
  try {
    const list = await GroceryList.findOne({ 
      _id: req.params.listId,
      userId: req.params.userId 
    });
    
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    Object.assign(list, req.body);
    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark list as completed
router.patch('/:userId/:listId/complete', async (req, res) => {
  try {
    const list = await GroceryList.findOneAndUpdate(
      { 
        _id: req.params.listId,
        userId: req.params.userId
      },
      { 
        status: 'completed',
        isFinalized: true,
        isEditable: false
      },
      { new: true }
    );
    
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update list items and checked state
router.put('/:userId/:listId', async (req, res) => {
    try {
      const list = await GroceryList.findOne({ 
        _id: req.params.listId,
        userId: req.params.userId 
      });
      
      if (!list) {
        return res.status(404).json({ message: 'List not found' });
      }
  
      // Update the list with new data
      list.items = req.body.items;
      list.totalCost = req.body.totalCost;
      list.checkedItems = req.body.checkedItems;
      list.isEditable = req.body.isEditable;
  
      const updatedList = await list.save();
      res.json(updatedList);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

module.exports = router;
