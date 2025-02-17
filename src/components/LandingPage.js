import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import KitchenImage from '../assets/kitchen.jpg'; // Add a kitchen-related image

const LandingPage = () => {
  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${KitchenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              mb: 4,
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            }}
          >
            Revolutionize Your Kitchen
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontFamily: 'Roboto, sans-serif',
              fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.75rem' },
            }}
          >
            Say goodbye to food waste and hello to efficient meal planning with our Kitchen Management System.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/auth"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#ff6f61',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '10px 30px',
                '&:hover': {
                  backgroundColor: '#ff3b2f',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '10px 30px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LandingPage;