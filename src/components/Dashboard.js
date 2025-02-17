import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import KitchenImage from '../assets/kitchen-background.jpg'; // Add a kitchen-related background image

const Dashboard = () => {
  const cards = [
    { title: 'Fridge Management', path: '/fridge', icon: '🧊' },
    { title: 'Meal Planning', path: '/meal-planning', icon: '🍽️' },
    { title: 'Waste Tracking', path: '/waste-tracking', icon: '🗑️' },
    { title: 'Grocery List', path: '/grocery-list', icon: '🛒' },
  ];

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${KitchenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        pt: 8,
        pb: 8,
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        sx={{
          color: 'white',
          fontWeight: 'bold',
          mb: 6,
          fontFamily: 'Playfair Display, serif',
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          textAlign: 'center',
        }}
      >
        Your Kitchen Dashboard
      </Typography>
      <Grid container spacing={4} sx={{ maxWidth: 1200, px: 2 }}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 4,
                  boxShadow: 6,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <CardActionArea component={Link} to={card.path}>
                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 200,
                    }}
                  >
                    <Typography
                      variant="h2"
                      component="div"
                      sx={{ mb: 2, fontSize: '3rem' }}
                    >
                      {card.icon}
                    </Typography>
                    <Typography
                      variant="h5"
                      component="h2"
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                        color: '#4facfe',
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {card.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;