const mongoose = require('mongoose');

const groceryListSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true  // For Firebase user ID, consistent with your Item model
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    checked: Boolean,
    added: Date
  }],
  totalCost: Number,
  isEditable: {
    type: Boolean,
    default: true
  },
  isFinalized: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GroceryList', groceryListSchema);
