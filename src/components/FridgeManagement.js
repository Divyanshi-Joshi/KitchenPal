import React, { useState, useEffect } from 'react';
import { auth } from '../firebase'; // Add this with other imports
import { onAuthStateChanged } from 'firebase/auth';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  CssBaseline,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EventIcon from '@mui/icons-material/Event';
import { FoodImageService } from './FoodImageService';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const initialFridgeItems = [
  { id: 1, itemName: 'Milk', category: 'Dairy', quantity: 1, expiryDate: '2025-03-01', imageURL: 'url_to_milk_image' },
  { id: 2, itemName: 'Apples', category: 'Fruits', quantity: 5, expiryDate: '2025-02-28', imageURL: 'url_to_apple_image' },
];

const FridgeManagement = () => {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(initialFridgeItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Add this useEffect for auth state monitoring
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      // Load items from localStorage when user logs in
      const savedItems = localStorage.getItem(`fridgeItems_${currentUser.uid}`);
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      } else {
        setItems(initialFridgeItems);
      }
    } else {
      // Clear items when user logs out
      setItems([]);
    }
  });

  // Cleanup subscription
  return () => unsubscribe();
}, []);

// Replace your existing localStorage useEffect with this
useEffect(() => {
  if (user) {
    localStorage.setItem(`fridgeItems_${user.uid}`, JSON.stringify(items));
  }
}, [items, user]);


const handleSubmit = (item) => {
  if (!user) {
    setSnackbarMessage('Please login to add items');
    setSnackbarOpen(true);
    return;
  }

  if (selectedItem) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...item, userId: user.uid } : i)));
    setSnackbarMessage('Item updated successfully!');
  } else {
    setItems((prev) => [...prev, { ...item, id: Date.now(), userId: user.uid }]);
    setSnackbarMessage('Item added successfully!');
  }
  setIsAddEditModalOpen(false);
  setSelectedItem(null);
  setSnackbarOpen(true);
};

const handleDelete = (id) => {
  if (!user) {
    setSnackbarMessage('Please login to delete items');
    setSnackbarOpen(true);
    return;
  }

  setItems((prev) => prev.filter((item) => item.id !== id));
  setSnackbarMessage('Item deleted successfully!');
  setSnackbarOpen(true);
};

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'warning';
    return 'good';
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Container>
      <CssBaseline />
      <AppBar position="static" sx={{ borderRadius: '0 0 16px 16px', marginBottom: 4 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <KitchenIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Smart Fridge Manager
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => setIsAddEditModalOpen(true)}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              px: 3
            }}
          >
            Add Item
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        backgroundColor: '#f5f5f5',
        p: 3,
        borderRadius: 2,
        mb: 4
      }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flex: 2,
            minWidth: '200px',
            backgroundColor: 'white'
          }}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
          }}
        />
        <FormControl 
          size="small" 
          sx={{ 
            flex: 1,
            minWidth: '150px',
            backgroundColor: 'white'
          }}
        >
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="Dairy">Dairy</MenuItem>
            <MenuItem value="Vegetables">Vegetables</MenuItem>
            <MenuItem value="Fruits">Fruits</MenuItem>
            <MenuItem value="Meat">Meat</MenuItem>
            <MenuItem value="Beverages">Beverages</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 2,
                  borderRadius: 3,
                  backgroundColor: getExpiryStatus(item.expiryDate) === 'expired' ? '#ffebee' :
                    getExpiryStatus(item.expiryDate) === 'warning' ? '#fff3e0' : '#e8f5e9',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <img
                    src={item.imageURL || '/default-food-image.png'}
                    alt={item.itemName}
                    style={{ 
                      width: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '12px'
                    }}
                  />
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                  />
                </Box>
                
                <Box sx={{ mt: 2, flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{item.itemName}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LocalOfferIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">Quantity: {item.quantity}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <EventIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Expires: {new Date(item.expiryDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  mt: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  pt: 2
                }}>
                  <Button
                    startIcon={<EditIcon />}
                    size="small"
                    onClick={() => { setSelectedItem(item); setIsAddEditModalOpen(true); }}
                    sx={{ textTransform: 'none' }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    size="small"
                    color="error"
                    onClick={() => handleDelete(item.id)}
                    sx={{ textTransform: 'none' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2
          }}
        >
          <img
            src="/empty-fridge.svg"
            alt="Empty Fridge"
            style={{ width: '200px', marginBottom: '24px' }}
          />
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
          <Button
            variant="contained"
            onClick={() => setIsAddEditModalOpen(true)}
            sx={{ mt: 2 }}
          >
            Add Your First Item
          </Button>
        </Box>
      )}

      <Dialog 
        open={isAddEditModalOpen} 
        onClose={() => setIsAddEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          pb: 3,
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            {selectedItem ? 'Edit Item' : 'Add New Item'}
          </Typography>
          <IconButton
            onClick={() => setIsAddEditModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <ItemForm
            initialData={selectedItem}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const ItemForm = ({ initialData, onSubmit }) => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Add debounced item name
  const debouncedItemName = useDebounce(itemName, 1000); // 1000ms = 1 second delay

  useEffect(() => {
    if (initialData) {
      setItemName(initialData.itemName);
      setCategory(initialData.category);
      setQuantity(initialData.quantity);
      setExpiryDate(initialData.expiryDate);
      setImageURL(initialData.imageURL);
    }
  }, [initialData]);

  // Move image fetching logic to useEffect
  useEffect(() => {
    const fetchImage = async () => {
      if (debouncedItemName && !imageURL && debouncedItemName.length >= 3) {
        setIsLoadingImage(true);
        setImageError(null);
        try {
          const autoImage = await FoodImageService.getImage(debouncedItemName);
          setImageURL(autoImage);
        } catch (error) {
          setImageError('Failed to fetch image. You can still add the item.');
        } finally {
          setIsLoadingImage(false);
        }
      }
    };

    fetchImage();
  }, [debouncedItemName]); // Only run when debouncedItemName changes

  // Simplified handleItemNameChange
  const handleItemNameChange = (e) => {
    const newItemName = e.target.value;
    setItemName(newItemName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ itemName, category, quantity, expiryDate, imageURL });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Item Name"
        value={itemName}
        onChange={handleItemNameChange}
        margin="normal"
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />

      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Item Image</Typography>
        
        {isLoadingImage ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '200px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px'
          }}>
            <CircularProgress />
          </Box>
        ) : imageURL ? (
          <Box sx={{ position: 'relative' }}>
            <img
              src={imageURL}
              alt={itemName}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
            <IconButton
              onClick={() => setImageURL('')}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '200px',
              borderRadius: '8px',
              border: '2px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Typography color="textSecondary">
              Enter item name to auto-fetch image
            </Typography>
          </Box>
        )}

        {imageError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {imageError}
          </Alert>
        )}
      </Box>

      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Vegetables">Vegetables</MenuItem>
          <MenuItem value="Fruits">Fruits</MenuItem>
          <MenuItem value="Meat">Meat</MenuItem>
          <MenuItem value="Beverages">Beverages</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        type="number"
        fullWidth
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
        margin="normal"
        required
        InputProps={{ inputProps: { min: 1 } }}
      />

      <TextField
        type="date"
        fullWidth
        label="Expiry Date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        margin="normal"
        required
        InputLabelProps={{ shrink: true }}
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth
        sx={{ 
          marginTop: 2,
          height: '48px',
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '16px'
        }}
      >
        {initialData ? 'Save Changes' : 'Add Item'}
      </Button>
    </form>
  );
};

export default FridgeManagement;
