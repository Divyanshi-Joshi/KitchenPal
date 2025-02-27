// src/components/Authentication.js
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Alert, Grid, IconButton, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import KitchenIcon from '@mui/icons-material/Kitchen';
import kitchenLogo from '../assets/kitchen-logo.jpeg'; 
import KitchenImage from '../assets/kitchen-auth.jpg';

const Authentication = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date(),
        });
      }
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${KitchenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <motion.div
          animate={{ 
            rotate: [0, 360],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            color: '#ff6b6b',
          }}
        >
          <RestaurantIcon sx={{ fontSize: 60 }} />
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [360, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            color: '#4CAF50',
          }}
        >
          <KitchenIcon sx={{ fontSize: 50 }} />
        </motion.div>
      </Box>

      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Paper
            elevation={24}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: { xs: 2.5, sm: 4 },
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 3 
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box
                  sx={{
                    borderRadius: '50%',
                    overflow: 'hidden',
                    width: 90,
                    height: 90,
                    marginBottom: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
                  }}
                >
                  <img 
                    src={kitchenLogo} 
                    alt="Kitchen Management System" 
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      objectFit: 'cover'
                    }} 
                  />
                </Box>
              </motion.div>
              <Typography 
                variant="h5" 
                component="h1" 
                align="center" 
                gutterBottom 
                sx={{ 
                  color: '#2c3e50',
                  fontWeight: 700,
                  fontSize: { xs: '1.5rem', sm: '1.8rem' }
                }}
              >
                {isLogin ? 'Welcome Back!' : 'Join Our Kitchen!'}
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  mb: 1.5
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#ff6b6b',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                    '&:hover': {
                      backgroundColor: '#ff5252',
                      boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                    }
                  }}
                >
                  {isLogin ? 'Start Cooking' : 'Join Our Kitchen'}
                </Button>
              </motion.div>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#666', display: 'inline' }}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Typography>
              <Button 
                onClick={() => setIsLogin(!isLogin)} 
                sx={{ 
                  color: '#ff6b6b',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  }
                }}
              >
                {isLogin ? 'Register' : 'Login'}
              </Button>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    borderRadius: '10px',
                    fontSize: '0.875rem'
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Authentication;
