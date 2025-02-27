import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import KitchenImage from '../assets/kitchen-background.jpg';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const Dashboard = () => {
  // Sample data for charts
  const foodCategoryData = [
    { name: 'Vegetables', value: 35 },
    { name: 'Fruits', value: 25 }, 
    { name: 'Dairy', value: 20 },
    { name: 'Meat', value: 15 },
    { name: 'Other', value: 5 },
  ];

  // Fresh, appetizing colors
  const COLORS = ['#7CB342', '#FFA726', '#42A5F5', '#EF5350', '#AB47BC'];

  const wastageData = [
    { name: 'Week 1', amount: 12 },
    { name: 'Week 2', amount: 8 },
    { name: 'Week 3', amount: 15 }, 
    { name: 'Week 4', amount: 6 },
  ];

  const expiringItems = [
    { name: 'Fresh Milk', date: '2024-01-20', category: 'Dairy' },
    { name: 'Organic Tomatoes', date: '2024-01-21', category: 'Vegetables' },
    { name: 'Free-Range Chicken', date: '2024-01-21', category: 'Meat' },
  ];

  const cards = [
    {
      title: 'Smart Fridge',
      description: 'Keep track of your fresh ingredients with our intelligent inventory system',
      path: '/fridge',
      icon: '🧊',
      gradient: 'linear-gradient(135deg, #43C6AC 0%, #191654 100%)'
    },
    {
      title: 'Meal Inspiration',
      description: 'Discover delicious recipes and plan your weekly meals effortlessly',
      path: '/meal-planning', 
      icon: '🍽️',
      gradient: 'linear-gradient(135deg, #FF9A9E 0%, #F6416C 100%)'
    },
    {
      title: 'Food Waste Monitor',
      description: 'Track and minimize food waste for a sustainable kitchen',
      path: '/waste-tracking',
      icon: '🌱',
      gradient: 'linear-gradient(135deg, #00F260 0%, #0575E6 100%)'
    },
    {
      title: 'Shopping Assistant',
      description: 'Smart shopping lists that sync with your fridge inventory',
      path: '/grocery-list',
      icon: '🛒',
      gradient: 'linear-gradient(135deg, #FDC830 0%, #F37335 100%)'
    },
  ];

  const gradientOffset = () => {
    const dataMax = Math.max(...wastageData.map(i => i.amount));
    const dataMin = Math.min(...wastageData.map(i => i.amount));
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${KitchenImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: 6,
        pb: 8,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: '800',
            mb: 5,
            fontFamily: '"Playfair Display", serif',
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
            textAlign: 'center',
            textShadow: '2px 2px 8px rgba(0,0,0,0.4)',
            letterSpacing: '1px',
            '& span': {
              color: '#FFD700'
            }
          }}
        >
          Welcome to Your <span>Culinary Hub</span>
        </Typography>
      </motion.div>

      <Grid container spacing={4} sx={{ maxWidth: 1400, px: 3 }}>
        <AnimatePresence>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.97)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    overflow: 'hidden',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '6px',
                      background: card.gradient
                    }
                  }}
                >
                  <CardActionArea 
                    component={Link} 
                    to={card.path}
                    sx={{
                      height: '100%',
                      background: 'transparent',
                      transition: 'all 0.4s ease',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                      }
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 220,
                        p: 4,
                        position: 'relative',
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: card.gradient,
                          mb: 3,
                          fontSize: '3rem',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                          transform: 'rotate(-10deg)'
                        }}
                      >
                        {card.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        component="h2"
                        align="center"
                        sx={{
                          fontWeight: 700,
                          color: '#1a1a1a',
                          fontFamily: '"Poppins", sans-serif',
                          mb: 2
                        }}
                      >
                        {card.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        align="center"
                        sx={{
                          color: '#666',
                          fontFamily: '"Poppins", sans-serif',
                          lineHeight: 1.6
                        }}
                      >
                        {card.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>

        {/* Food Category Distribution Chart */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                height: '450px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 700, 
                  color: '#1a1a1a',
                  fontFamily: '"Poppins", sans-serif',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: 60,
                    height: 3,
                    background: 'linear-gradient(90deg, #7CB342, #FFA726)'
                  }
                }}
              >
                Kitchen Inventory Overview
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={foodCategoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {foodCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 12, 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      border: 'none',
                      background: 'rgba(255,255,255,0.98)'
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        {/* Monthly Food Waste Trends */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                height: '450px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 700, 
                  color: '#1a1a1a',
                  fontFamily: '"Poppins", sans-serif',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: 60,
                    height: 3,
                    background: 'linear-gradient(90deg, #43C6AC, #191654)'
                  }
                }}
              >
                Waste Reduction Progress
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={wastageData}>
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={off} stopColor="#43C6AC" stopOpacity={0.8}/>
                      <stop offset={off} stopColor="#191654" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 12, 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      border: 'none',
                      background: 'rgba(255,255,255,0.98)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#43C6AC"
                    fill="url(#splitColor)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </motion.div>
        </Grid>

        {/* Expiring Items Alert */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 4,
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.97)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 4, 
                  fontWeight: 700, 
                  color: '#1a1a1a',
                  fontFamily: '"Poppins", sans-serif',
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: 0,
                    width: 60,
                    height: 3,
                    background: 'linear-gradient(90deg, #FF9A9E, #F6416C)'
                  }
                }}
              >
                Freshness Monitor
              </Typography>
              <Grid container spacing={3}>
                {expiringItems.map((item) => (
                  <Grid item xs={12} sm={4} key={item.name}>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Card 
                        sx={{ 
                          background: 'linear-gradient(135deg, rgba(255,154,158,0.1) 0%, rgba(246,65,108,0.1) 100%)',
                          borderRadius: 4,
                          border: '1px solid rgba(246,65,108,0.2)',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: '#1a1a1a',
                              fontFamily: '"Poppins", sans-serif',
                              mb: 2
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#666',
                              fontFamily: '"Poppins", sans-serif',
                              mb: 1
                            }}
                          >
                            Category: {item.category}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#F6416C', 
                              fontWeight: 600,
                              fontFamily: '"Poppins", sans-serif'
                            }}
                          >
                            Use by: {new Date(item.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
