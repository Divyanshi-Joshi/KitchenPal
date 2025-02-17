/* src/components/FridgeManagement.js */
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import KitchenIcon from '@mui/icons-material/Kitchen';

const FridgeManagement = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', expiryDate: '', quantity: '' });
  const [editItem, setEditItem] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showFridgeItems, setShowFridgeItems] = useState(false);

  // Fetch items from Firestore ordered by expiry date
  const fetchItems = async () => {
    const q = query(collection(db, 'fridgeItems'), orderBy('expiryDate'));
    const querySnapshot = await getDocs(q);
    const itemsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(itemsData);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (newItem.name && newItem.expiryDate && newItem.quantity) {
      await addDoc(collection(db, 'fridgeItems'), newItem);
      setNewItem({ name: '', expiryDate: '', quantity: '' });
      setSnackbarMessage('Item added successfully!');
      setOpenSnackbar(true);
      fetchItems();
    }
  };

  const handleEditItem = (item) => {
    setEditItem(item);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (editItem.name && editItem.expiryDate && editItem.quantity) {
      await updateDoc(doc(db, 'fridgeItems', editItem.id), {
        name: editItem.name,
        expiryDate: editItem.expiryDate,
        quantity: editItem.quantity
      });
      setOpenEditDialog(false);
      setSnackbarMessage('Item updated successfully!');
      setOpenSnackbar(true);
      fetchItems();
    }
  };

  const handleDeleteItem = async (id) => {
    await deleteDoc(doc(db, 'fridgeItems', id));
    setSnackbarMessage('Item deleted successfully!');
    setOpenSnackbar(true);
    fetchItems();
  };

  const handleExpiryAlert = (item) => {
    const daysUntilExpiry = moment(item.expiryDate).diff(moment(), 'days');
    if (daysUntilExpiry <= 3) {
      return (
        <Alert severity="warning" sx={{ mt: 1 }}>
          Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
        </Alert>
      );
    }
    return null;
  };

  const predictInventoryNeeds = () => {
    console.log('Predicting inventory needs...');
  };

  const suggestUsageTimeline = (item) => {
    console.log(`Suggesting usage timeline for ${item.name}...`);
    return 'Use within the next 3 days for best freshness';
  };

  const toggleFridgeItems = () => {
    setShowFridgeItems(!showFridgeItems);
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #000000, #2e2e2e)',
        minHeight: '100vh',
        py: 4,
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', mb: 4 }}
      >
        Fridge Management
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {/* Left Column: Fridge/Pantry visual */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box
            onClick={toggleFridgeItems}
            sx={{
              background: 'linear-gradient(180deg, #3a3a3a, #1f1f1f)',
              borderRadius: 2,
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.8)',
              width: { xs: '100%', md: 280 },
              height: 450,
              p: 2,
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden',
              border: '3px solid #4facfe'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <KitchenIcon sx={{ fontSize: 80, color: '#4facfe' }} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 0,
                right: 0,
                textAlign: 'center',
                color: '#4facfe',
                fontWeight: 'bold',
                textShadow: '0px 0px 10px rgba(0,0,0,0.8)'
              }}
            >
              {showFridgeItems ? 'Hide Fridge Contents' : 'View Fridge Contents'}
            </Typography>
            {/* Fridge items overlay */}
            {showFridgeItems && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  overflowY: 'auto',
                  p: 1,
                }}
              >
                <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, color: 'white' }}>
                  Fridge Contents
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                >
                  {items.length > 0 ? (
                    items.map(item => (
                      <Card
                        key={item.id}
                        sx={{
                          width: 100,
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(2px)',
                          border: '1px solid #4facfe',
                          color: 'white'
                        }}
                      >
                        <CardContent sx={{ p: 0, textAlign: 'center' }}>
                          <Typography variant="body2" noWrap>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" noWrap>
                            Qty: {item.quantity}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ mt: 2, color: 'white' }}>
                      No items stored.
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </motion.div>

        {/* Right Column: Add/Edit/Inventory */}
        <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Add New Item
              </Typography>
              <form onSubmit={handleAddItem}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  margin="normal"
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Quantity"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  margin="normal"
                  required
                />
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: '#4facfe' }}
                >
                  Add Item
                </Button>
              </form>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: 4,
                borderRadius: 2,
                boxShadow: 3,
                mt: 4,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Fridge Inventory
              </Typography>
              <List>
                {items.map(item => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ListItem
                      sx={{
                        backgroundColor: moment(item.expiryDate).isBefore(moment().add(3, 'days')) ? 'rgba(255, 240, 240, 0.7)' : 'transparent',
                        borderRadius: 1,
                        mb: 1,
                      }}
                    >
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity} | Expires: ${moment(item.expiryDate).format('YYYY-MM-DD')}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditItem(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteItem(item.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {handleExpiryAlert(item)}
                    <Typography variant="body2" color="text.secondary">
                      {suggestUsageTimeline(item)}
                    </Typography>
                  </motion.div>
                ))}
              </List>
            </Box>
          </motion.div>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button variant="contained" onClick={predictInventoryNeeds} sx={{ backgroundColor: '#4facfe' }}>
              Predict Inventory Needs
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={editItem?.name || ''}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Expiry Date"
            type="date"
            fullWidth
            value={editItem?.expiryDate || ''}
            onChange={(e) => setEditItem({ ...editItem, expiryDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            label="Quantity"
            fullWidth
            value={editItem?.quantity || ''}
            onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FridgeManagement;