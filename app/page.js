"use client";
import React from "react";
import { SignedOut, SignedIn, UserButton, useUser } from '@clerk/clerk-react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Grow,
  Paper,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Container from "@mui/material/Container";
import { motion } from "framer-motion";
import getStripe from "./utils/get-stripe";

const handleSubmit = async () => {
  const checkoutSession = await fetch("/api/checkout_sessions", {
    method: "POST",
    headers: { origin: "http://localhost:3001" },
  });
  const checkoutSessionJson = await checkoutSession.json();

  const stripe = await getStripe();
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  });

  if (error) {
    console.warn(error.message);
  }
};

const HomePage = () => {
  const { user } = useUser();
  const username = user ? user.firstName : '';

  return (
    <Container maxWidth="lg" sx={{ bgcolor: '#121212', color: '#FFF' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1E1E1E' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#FFA500' }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in" sx={{ color: '#FFF' }}>
              Login
            </Button>
            <Button color="inherit" href="/sign-up" sx={{ color: '#FFF' }}>
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <Typography sx={{ mr: 2, color: '#FFA500' }}>Hello, {username}</Typography>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Typography variant="h2" gutterBottom sx={{ color: '#FFA500' }}>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ color: '#FFF' }}>
            The easiest way to create flashcards from your text.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button
            variant="contained"
            sx={{ mt: 4, mr: 2, bgcolor: '#FFA500', color: '#121212' }}
            href="/generate"
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 4, borderColor: '#FFA500', color: '#FFA500' }}
          >
            Learn More
          </Button>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Box sx={{ my: 8 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#FFA500' }}>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Grow in>
              <Paper elevation={4} sx={{ padding: 4, bgcolor: '#1E1E1E', color: '#FFF' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FFA500' }}>
                  Easy to Use
                </Typography>
                <Typography>
                  Intuitive interface designed for effortless flashcard creation.
                </Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Grow in timeout={1000}>
              <Paper elevation={4} sx={{ padding: 4, bgcolor: '#1E1E1E', color: '#FFF' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FFA500' }}>
                  AI-Powered Flashcards
                </Typography>
                <Typography>
                  Automatically generate flashcards with AI from any text.
                </Typography>
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Grow in timeout={1500}>
              <Paper elevation={4} sx={{ padding: 4, bgcolor: '#1E1E1E', color: '#FFF' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#FFA500' }}>
                  Cloud Storage
                </Typography>
                <Typography>
                  Save your flashcards securely in the cloud for easy access.
                </Typography>
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ my: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#FFA500' }}>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card raised sx={{ bgcolor: '#1E1E1E', color: '#FFF' }}>
                <CardContent>
                  <Typography variant="h5" component="div" sx={{ color: '#FFA500' }}>
                    Ultimate Plan - $10/month
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    Get full access to our flashcard system: unlimited flashcards, AI-powered creation, and secure cloud storage.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ bgcolor: '#FFA500', color: '#121212' }}
                    onClick={handleSubmit}
                  >
                    Start Your Journey
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
