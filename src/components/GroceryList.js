// src/components/GroceryList.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, Chip, Grid, Card, CardContent, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { FoodImageService } from './FoodImageService';

const GroceryList = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [recipe, setRecipe] = useState('');
  const [servings, setServings] = useState(4);
  const [totalCost, setTotalCost] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});

  const [aiSuggestions, setAiSuggestions] = useState([
    { name: 'Milk', reason: 'Running low based on usage pattern', quantity: '1L', price: 3.99 },
    { name: 'Eggs', reason: 'Usually purchased weekly', quantity: '12 pcs', price: 4.50 },
    { name: 'Bananas', reason: 'Expired yesterday', quantity: '1 bunch', price: 2.99 },
    { name: 'Chicken Breast', reason: 'Frequently bought item running low', quantity: '500g', price: 8.99 }
  ]);

  const recipes = {
    'biryani': {
      ingredients: [
        { name: 'Basmati Rice', baseQuantity: '500g', basePrice: 5.99 },
        { name: 'Chicken', baseQuantity: '750g', basePrice: 12.99 },
        { name: 'Onions', baseQuantity: '3 pcs', basePrice: 2.99 },
        { name: 'Yogurt', baseQuantity: '250g', basePrice: 3.50 },
        { name: 'Biryani Masala', baseQuantity: '50g', basePrice: 4.99 },
        { name: 'Saffron', baseQuantity: '1g', basePrice: 8.99 },
        { name: 'Ghee', baseQuantity: '100g', basePrice: 6.99 }
      ],
      baseServings: 4
    }
    // Add more recipes as needed
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem) {
      const newItemObj = {
        name: newItem,
        quantity: quantity,
        price: estimatedPrice,
        added: new Date(),
        checked: false
      };
      setItems([...items, newItemObj]);
      setNewItem('');
      setQuantity(1);
      setEstimatedPrice(0);
      updateTotalCost([...items, newItemObj]);
    }
  };

  const handleAddSuggestion = (suggestion) => {
    const newItemObj = {
      ...suggestion,
      added: new Date(),
      checked: false
    };
    setItems([...items, newItemObj]);
    setAiSuggestions(aiSuggestions.filter(item => item.name !== suggestion.name));
    updateTotalCost([...items, newItemObj]);
  };

  const handleDeleteItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    updateTotalCost(newItems);
  };

  const handleRecipeSelect = (e) => {
    const selectedRecipe = e.target.value;
    setRecipe(selectedRecipe);
    
    if (selectedRecipe && recipes[selectedRecipe]) {
      const recipeItems = recipes[selectedRecipe].ingredients.map(ingredient => {
        const servingRatio = servings / recipes[selectedRecipe].baseServings;
        return {
          name: ingredient.name,
          quantity: `${parseFloat(ingredient.baseQuantity) * servingRatio}${ingredient.baseQuantity.replace(/[\d.]/g, '')}`,
          price: ingredient.basePrice * servingRatio,
          added: new Date(),
          checked: false
        };
      });
      setItems([...items, ...recipeItems]);
      updateTotalCost([...items, ...recipeItems]);
    }
  };

  const handleToggleCheck = (index) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  const updateTotalCost = (itemsList) => {
    const total = itemsList.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalCost(total);
  };

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: 4,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" sx={{ mb: 4, color: '#2c3e50', fontWeight: 'bold', textAlign: 'center' }}>
          Smart Grocery List
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
              <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder="Add grocery item"
                  sx={{ backgroundColor: 'white' }}
                />
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  sx={{ width: '100px' }}
                />
                <TextField
                  type="number"
                  label="Est. Price"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(parseFloat(e.target.value))}
                  sx={{ width: '100px' }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddCircleIcon />}
                  sx={{ 
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#388E3C' }
                  }}
                >
                  Add
                </Button>
              </form>

              <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Add Recipe Items</InputLabel>
                  <Select
                    value={recipe}
                    onChange={handleRecipeSelect}
                    label="Add Recipe Items"
                  >
                    <MenuItem value="biryani">Biryani</MenuItem>
                    {/* Add more recipe options */}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="Number of Servings"
                  value={servings}
                  onChange={(e) => setServings(parseInt(e.target.value))}
                  sx={{ mt: 2, width: '200px' }}
                />
              </Box>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Total Estimated Cost: ${totalCost.toFixed(2)}
              </Typography>

              <List>
                {items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem 
                      sx={{ 
                        backgroundColor: 'white',
                        mb: 1,
                        borderRadius: 1,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Checkbox
                        checked={item.checked}
                        onChange={() => handleToggleCheck(index)}
                      />
                      <ListItemIcon>
                        <ShoppingCartIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${item.name} (${item.quantity})`}
                        secondary={`Price: $${item.price?.toFixed(2) || '0.00'}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" onClick={() => handleDeleteItem(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </motion.div>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
                  AI-Suggested Items
                </Typography>
                <List>
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ListItem 
                        sx={{ 
                          backgroundColor: '#f5f5f5',
                          mb: 1,
                          borderRadius: 1,
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: '#e0e0e0' }
                        }}
                        onClick={() => handleAddSuggestion(suggestion)}
                      >
                        <ListItemText 
                          primary={`${suggestion.name} (${suggestion.quantity})`}
                          secondary={`${suggestion.reason} - $${suggestion.price.toFixed(2)}`}
                        />
                        <Chip 
                          label="Add" 
                          color="primary" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default GroceryList;
