/* src/components/GroceryList.js */

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, ListItemIcon,
  ListItemSecondaryAction, IconButton, Chip, Grid, Card, CardContent, Checkbox, FormControl,
  InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LockIcon from '@mui/icons-material/Lock';
import { HfInference } from "@huggingface/inference";
// Firebase imports
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const GroceryList = () => {
  const navigate = useNavigate();
  
  // Original state variables for grocery list management
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [checkedItems, setCheckedItems] = useState({});
  
  // LLM section state
  const [dishForLLM, setDishForLLM] = useState('');
  const [llmLoading, setLlmLoading] = useState(false);
  
  // AI suggestions state
  // Replace the hardcoded aiSuggestions state with an empty array
const [aiSuggestions, setAiSuggestions] = useState([]);
const [suggestionsLoading, setSuggestionsLoading] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
// Add this useEffect after your other useEffects
// Dependencies  
  // (Optional) Recipes object – fill this with your recipes if needed.
  const recipes = {};
  
  // List management and backend integration state
  const [isEditable, setIsEditable] = useState(true);
  const [isFinalized, setIsFinalized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentListId, setCurrentListId] = useState(null);
  
  // Authentication state
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  
  // Firebase auth listener
  useEffect(() => {
    setAuthChecking(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email);
        setIsAuthenticated(true);
      } else {
        setUserId(null);
        setUserEmail(null);
        setIsAuthenticated(false);
        
        // Redirect to login if not authenticated
        // Only redirect if we're past the initial auth check
        if (!authChecking) {
          navigate('/login', { state: { from: '/grocery-list' } });
        }
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, [navigate]);
  
  // Update total cost based on items
  const updateTotalCost = (itemsList) => {
    const total = itemsList.reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalCost(total);
  };

  useEffect(() => {
    const loadAISuggestions = async () => {
      if (!isAuthenticated || authChecking) return;
      
      setSuggestionsLoading(true);
      try {
        const suggestions = await generateAISuggestions();
        setAiSuggestions(suggestions);
      } catch (error) {
        console.error('Error loading AI suggestions:', error);
        setError('Failed to load AI suggestions');
      } finally {
        setSuggestionsLoading(false);
      }
    };
  
    loadAISuggestions();
  }, [isAuthenticated, authChecking]); 

  
  // Add a new grocery item (only if list is editable)
  const handleAddItem = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to manage your grocery list');
      return;
    }
    
    if (newItem && isEditable) {
      const newItemObj = {
        name: newItem,
        quantity: quantity,
        price: estimatedPrice,
        added: new Date(),
        checked: false
      };
      const updatedItems = [...items, newItemObj];
      setItems(updatedItems);
      setNewItem('');
      setQuantity(1);
      setEstimatedPrice(0);
      updateTotalCost(updatedItems);
    }
  };
  
  // Add an item from AI suggestions
  const handleAddSuggestion = (suggestion) => {
    if (!isAuthenticated) {
      setError('Please log in to manage your grocery list');
      return;
    }
    
    const newItemObj = {
      ...suggestion,
      added: new Date(),
      checked: false
    };
    const updatedItems = [...items, newItemObj];
    setItems(updatedItems);
    setAiSuggestions(aiSuggestions.filter(item => item.name !== suggestion.name));
    updateTotalCost(updatedItems);
  };
  
  // Delete an item (only if list is editable)
  const handleDeleteItem = (index) => {
    if (!isAuthenticated) {
      setError('Please log in to manage your grocery list');
      return;
    }
    
    if (isEditable) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
      updateTotalCost(updatedItems);
    }
  };
  
  // Toggle check status on an item
  const handleToggleCheck = async (index) => {
    if (!isAuthenticated) {
      setError('Please log in to manage your grocery list');
      return;
    }
    
    const updatedItems = [...items];
    updatedItems[index].checked = !updatedItems[index].checked;
    setItems(updatedItems);
  
    // Save the updated checked state to backend
    if (currentListId) {
      try {
        await fetch(`${API_BASE_URL}/grocery-lists/${userId}/${currentListId}`, {
          method: 'PUT',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: updatedItems,
            totalCost,
            checkedItems
          })
        });
      } catch (error) {
        console.error('Error saving checked state:', error);
      }
    }
  };
  
  // Recipe selection (if using recipes)
  
  // --- LLM Integration Handler ---
  const generateGroceriesForDish = async () => {
    if (!isAuthenticated || !dishForLLM) return;
    
    setLlmLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai/dish-ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dish: dishForLLM })
      });
  
      if (!response.ok) throw new Error('Failed to generate ingredients');
      
      const ingredients = await response.json();
      const newGroceryItems = ingredients.map(item => ({
        name: item.name,
        quantity: 1,
        price: item.price / 83, // Convert INR to USD
        added: new Date(),
        checked: false
      }));
  
      const updatedItems = [...items, ...newGroceryItems];
      setItems(updatedItems);
      updateTotalCost(updatedItems);
    } catch (error) {
      console.error('Error generating ingredients:', error);
      setError('Failed to generate grocery list. Please try again later.');
    } finally {
      setDishForLLM('');
      setLlmLoading(false);
    }
  };
  
  // --- Auth-Required API Functions ---
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth.currentUser?.getIdToken()}`
    };
  };

  
  // --- Backend List Management Functions ---
  // Add these constants at the top of your file
const API_BASE_URL = 'http://localhost:5000/api';
 // Adjust the URL based on your backend
// Add this function after your other API-related functions
const generateAISuggestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/suggestions`);
    if (!response.ok) throw new Error('Failed to fetch suggestions');
    const suggestions = await response.json();
    return suggestions.map(suggestion => ({
      ...suggestion,
      price: suggestion.price / 83 // Convert INR to USD
    }));
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
};
// Update the saveListToBackend function
const saveListToBackend = async () => {
  if (!isAuthenticated) {
    setError('Please log in to save your list');
    navigate('/login', { state: { from: '/grocery-list' } });
    return;
  }
  
  setIsLoading(true);
  setError(null);
  try {
    const listData = {
      items,
      totalCost,
      checkedItems,
      isEditable: false,
      isFinalized: true,
      status: 'active',
      userId
    };
    
    const response = await fetch(`${API_BASE_URL}/grocery-lists/${userId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save list');
    }
    
    const savedList = await response.json();
    setCurrentListId(savedList._id);
  } catch (error) {
    console.error('Error saving list:', error);
    setError('Failed to save list. Please try again.');
    setIsEditable(true);
    setIsFinalized(false);
  } finally {
    setIsLoading(false);
  }
};
  
const markListAsCompleted = async () => {
  if (!isAuthenticated || !currentListId) {
    setError('Unable to complete list');
    return;
  }
  
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch(
      `${API_BASE_URL}/grocery-lists/${userId}/${currentListId}/complete`,
      {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to mark list as completed');
    }
    
    // Clear the list locally
    setItems([]);
    setTotalCost(0);
    setCurrentListId(null);
    setIsFinalized(false);
    setIsEditable(true);
  } catch (error) {
    console.error('Error marking list as completed:', error);
    setError('Failed to complete list. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  // These handlers determine the list's state.
  const handleGenerateList = () => {
    if (!isAuthenticated) {
      setError('Please log in to generate a list');
      navigate('/login', { state: { from: '/grocery-list' } });
      return;
    }
    
    setIsEditable(false);
    setIsFinalized(true);
    saveListToBackend();
  };
  
  const handleEdit = () => {
    if (!isAuthenticated) {
      setError('Please log in to edit your list');
      navigate('/login', { state: { from: '/grocery-list' } });
      return;
    }
    
    setIsEditable(true);
    setIsEditMode(true);
  };
  
  const handleDoneEditing = async () => {
    if (!isAuthenticated) {
      setError('Please log in to save changes');
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/grocery-lists/${userId}/${currentListId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items,
          totalCost,
          checkedItems,
          isEditable: false
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
      setIsEditMode(false);
      setIsEditable(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFinish = () => {
    if (!isAuthenticated) {
      setError('Please log in to finish your shopping');
      navigate('/login', { state: { from: '/grocery-list' } });
      return;
    }
    
    setIsFinalized(false);
    markListAsCompleted();
  };
  
  // On mount or when authentication changes, load the user's current saved list
  useEffect(() => {
    const loadSavedList = async () => {
      if (!isAuthenticated || authChecking || !userId) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${API_BASE_URL}/grocery-lists/${userId}/current`,
          { 
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            // No current list - this is fine, just start fresh
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to load saved list');
        }
        
        const data = await response.json();
        if (data) {
          setItems(data.items || []);
          setCheckedItems(data.checkedItems || {});
          setTotalCost(data.totalCost || 0);
          setIsFinalized(data.isFinalized || false);
          setIsEditable(data.isEditable || true);
          setCurrentListId(data._id);
        }
      } catch (error) {
        console.error('Error loading saved list:', error);
        setError('Failed to load saved list.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedList();
  }, [isAuthenticated, authChecking, userId]);
  
  // Show loading screen while checking authentication
  if (authChecking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading your grocery list...
        </Typography>
      </Box>
    );
  }

  
  
  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <Box sx={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 4,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
  <CardContent>
    <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
      AI-Suggested Items
    </Typography>
    <List>
      {suggestionsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : aiSuggestions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 2, color: '#64748B' }}>
          <Typography variant="body2">
            No suggestions available right now
          </Typography>
        </Box>
      ) : (
        aiSuggestions.map((suggestion, index) => (
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
                primary={`${suggestion.name} (${suggestion.quantity} ${suggestion.unit})`}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      ₹{(suggestion.price * 83).toFixed(2)}
                    </Typography>
                    <br />
                    {suggestion.reason}
                  </React.Fragment>
                }
              />
              <Chip 
                label="Add" 
                color="primary" 
                size="small" 
                sx={{ ml: 1 }}
              />
            </ListItem>
          </motion.div>
        ))
      )}
    </List>
  </CardContent>
</Card>
      </Box>
    );
  }
  
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
        <Typography variant="h3" sx={{ mb: 2, color: '#2c3e50', fontWeight: 'bold', textAlign: 'center' }}>
          Smart Grocery List
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mb: 4, textAlign: 'center', color: '#64748B' }}>
          Logged in as: {userEmail}
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
  {/* Left column: Main Grocery List */}
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
          disabled={!isEditable}
        />
        <TextField
          type="number"
          label="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          sx={{ width: '100px' }}
          disabled={!isEditable}
        />
        <TextField
          type="number"
          label="Est. Price"
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(parseFloat(e.target.value))}
          sx={{ width: '100px' }}
          disabled={!isEditable}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddCircleIcon />}
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#388E3C' } }}
          disabled={!isEditable}
        >
          Add
        </Button>
      </form>

      {/* Generate from Dish Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
          Generate Grocery List from Dish
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter a dish name (e.g., Spaghetti Carbonara)"
            value={dishForLLM}
            onChange={(e) => setDishForLLM(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          />
          <Button
            variant="contained"
            onClick={generateGroceriesForDish}
            disabled={llmLoading || !dishForLLM}
            sx={{ 
              backgroundColor: '#2196F3',
              '&:hover': { backgroundColor: '#1976D2' },
              minWidth: '150px'
            }}
          >
            {llmLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Generating...
              </>
            ) : "Generate"}
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Total Estimated Cost: ₹{(totalCost * 83).toFixed(2)}
      </Typography>
      <List>
        {items.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, color: '#64748B' }}>
            <Typography variant="body1">
              Your grocery list is empty. Add items or generate from a dish.
            </Typography>
          </Box>
        )}
        
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
                secondary={`Price: ₹${(item.price * 83).toFixed(2)}`}
              />
              {isEditable && (
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleDeleteItem(index)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Paper>
  </Grid>


  {/* Right column: AI-Suggested Items */}
  <Grid item xs={12} md={5}>
    <Card elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, color: '#1a237e' }}>
          AI-Suggested Items
        </Typography>
        <List>
          {aiSuggestions.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 2, color: '#64748B' }}>
              <Typography variant="body2">
                No suggestions available right now
              </Typography>
            </Box>
          ) : (
            aiSuggestions.map((suggestion, index) => (
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
                    secondary={`${suggestion.reason} - ₹${(suggestion.price * 83).toFixed(2)}`}
                  />
                  <Chip 
                    label="Add" 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              </motion.div>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  </Grid>
</Grid>
        
        {/* Loading feedback */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Action Buttons for List Management */}
        {/* Action Buttons for List Management */}
{items.length > 0 && (
  <>
    {!isFinalized && (
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleGenerateList}
        disabled={isLoading}
        sx={{ mt: 2 }}
      >
        {isLoading ? 'Generating...' : 'Generate List'}
      </Button>
    )}
    {isFinalized && (
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {!isEditMode ? (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleEdit}
            disabled={isLoading}
          >
            Edit List
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={handleDoneEditing}
            disabled={isLoading}
          >
            Done
          </Button>
        )}
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={handleFinish}
          disabled={isLoading || isEditMode}
        >
          Finish Shopping
        </Button>
      </Box>
    )}
  </>
)}
      </motion.div>
    </Box>
  );
};

export default GroceryList;
