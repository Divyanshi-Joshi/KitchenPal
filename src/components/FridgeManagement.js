import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
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
  useTheme,
  alpha,
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
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(initialFridgeItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        // Fetch items when user logs in
        fetchItems(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchItems = async (userId) => {
    try {
      const response = await axios.get(`/api/items/${userId}`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem(`fridgeItems_${user.uid}`, JSON.stringify(items));
    }
  }, [items, user]);

  const handleSubmit = async (item) => {
    if (!user) {
      setSnackbarMessage('Please login to add items');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (selectedItem) {
        await axios.put(`/api/items/${user.uid}/${selectedItem._id}`, item);
      } else {
        await axios.post(`/api/items/${user.uid}`, item);
      }
      
      // Refresh items list
      await fetchItems(user.uid);
      setIsAddEditModalOpen(false);
      setSelectedItem(null);
      setSnackbarMessage('Item saved successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Error saving item');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (!user) {
      setSnackbarMessage('Please login to delete items');
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.delete(`/api/items/${user.uid}/${id}`);
      setItems(prev => prev.filter(item => item._id !== id));
      setSnackbarMessage('Item deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Error deleting item');
      setSnackbarOpen(true);
    }
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
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: alpha(theme.palette.primary.main, 0.03),
      pb: 8 
    }}>
      <CssBaseline />
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
          borderRadius: '0 0 24px 24px',
          mb: 4 
        }}
      >
        <Toolbar sx={{ height: 80 }}>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <KitchenIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Smart Fridge Manager
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setIsAddEditModalOpen(true)}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: '28px',
              textTransform: 'none',
              px: 4,
              py: 1.5,
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.9),
              }
            }}
          >
            Add Item
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexWrap: 'wrap',
          backgroundColor: 'white',
          p: 3,
          borderRadius: 4,
          mb: 4,
          boxShadow: theme.shadows[2]
        }}>
          <TextField
            size="medium"
            variant="outlined"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              flex: 2,
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                borderRadius: 3
              }
            }}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
          />
          <FormControl 
            size="medium" 
            sx={{ 
              flex: 1,
              minWidth: '200px'
            }}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
              sx={{ borderRadius: 3 }}
            >
              <MenuItem value="all">All Categories</MenuItem>
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
                transition={{ duration: 0.4 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    padding: 0,
                    borderRadius: 4,
                    backgroundColor: getExpiryStatus(item.expiryDate) === 'expired' ? alpha(theme.palette.error.light, 0.1) :
                      getExpiryStatus(item.expiryDate) === 'warning' ? alpha(theme.palette.warning.light, 0.1) : alpha(theme.palette.success.light, 0.1),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={item.imageURL || '/default-food-image.png'}
                      alt={item.itemName}
                      style={{ 
                        width: '100%', 
                        height: '220px', 
                        objectFit: 'cover'
                      }}
                    />
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(4px)',
                        fontWeight: 600,
                        boxShadow: theme.shadows[2]
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ p: 3, flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>{item.itemName}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocalOfferIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EventIcon sx={{ fontSize: 20, mr: 1, color: theme.palette.text.secondary }} />
                      <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ 
                    px: 3,
                    pb: 3,
                    display: 'flex', 
                    justifyContent: 'space-between',
                    gap: 2
                  }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => { setSelectedItem(item); setIsAddEditModalOpen(true); }}
                      sx={{ 
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDelete(item.id)}
                      sx={{ 
                        flex: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
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
              py: 12,
              px: 2,
              backgroundColor: 'white',
              borderRadius: 4,
              boxShadow: theme.shadows[2]
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src="/empty-fridge.svg"
                alt="Empty Fridge"
                style={{ width: '240px', marginBottom: '32px' }}
              />
              <Typography variant="h5" sx={{ color: theme.palette.text.secondary, mb: 3, fontWeight: 600 }}>
                No items found in your fridge
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setIsAddEditModalOpen(true)}
                startIcon={<AddIcon />}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                Add Your First Item
              </Button>
            </motion.div>
          </Box>
        )}

        <Dialog 
          open={isAddEditModalOpen} 
          onClose={() => setIsAddEditModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 2
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 3,
            borderBottom: '1px solid',
            borderColor: theme.palette.divider
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {selectedItem ? 'Edit Item' : 'Add New Item'}
            </Typography>
            <IconButton
              onClick={() => setIsAddEditModalOpen(false)}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                color: theme.palette.text.secondary
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

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={4000} 
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity="success" 
            variant="filled"
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

const ItemForm = ({ initialData, onSubmit }) => {
  const theme = useTheme();
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [quantity, setQuantity] = useState(1);
  const [expiryDate, setExpiryDate] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState(null);

  const debouncedItemName = useDebounce(itemName, 1000);

  useEffect(() => {
    if (initialData) {
      setItemName(initialData.itemName);
      setCategory(initialData.category);
      setQuantity(initialData.quantity);
      setExpiryDate(initialData.expiryDate);
      setImageURL(initialData.imageURL);
    }
  }, [initialData]);

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
  }, [debouncedItemName]);

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
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
          mt: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }}
      />
      <Box sx={{ mt: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Item Image</Typography>
        
        {isLoadingImage ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '240px',
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 3
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
                height: '240px',
                objectFit: 'cover',
                borderRadius: '12px'
              }}
            />
            <IconButton
              onClick={() => setImageURL('')}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: 'white',
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
              height: '240px',
              borderRadius: 3,
              border: '2px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(theme.palette.primary.main, 0.05)
            }}
          >
            <Typography color="textSecondary" sx={{ fontWeight: 500 }}>
              Enter item name to auto-fetch image
            </Typography>
          </Box>
        )}

        {imageError && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
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
          sx={{ borderRadius: 2 }}
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
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
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
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2
          }
        }}
      />

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth
        sx={{ 
          mt: 4,
          mb: 2,
          height: '56px',
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1.1rem',
          fontWeight: 600
        }}
      >
        {initialData ? 'Save Changes' : 'Add Item'}
      </Button>
    </form>
  );
};

export default FridgeManagement;
