const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const ip = require("ip");
const RESPONSE_CODES = require("../constants/RESPONSE_CODES");
const RESPONSE_STATUS = require("../constants/RESPONSE_STATUS");
const authRouter = require("../routes/auth/authRouter");
const app = express();
dotenv.config({ path: path.join(__dirname, "./.env") });

// User profile update to store eco points
const user = {
    ...otherUserFields,
    ecoPoints: 0,
  };
  
  // Function to calculate eco points for a transaction
  const calculateEcoPoints = (transactionAmount) => {
    const ecoPointsPercentage = 0.05;
    return Math.round(transactionAmount * ecoPointsPercentage);
  };
  
  // Function to update user's eco points balance
  //   const calculateEcoPoints = (transactionAmount) => {
  //     return transactionAmount * 0.05; // Example calculation
  // };

const updateEcoPointsBalance = async (userId, pointsToAdd) => {
    const { data, error } = await supabase
        .from('users') // Replace with your actual table name
        .update({ ecoPoints: supabase.raw('ecoPoints + ?', [pointsToAdd]) }) // Assuming 'ecoPoints' is the column name
        .eq('id', userId);

    if (error) {
        console.error("Error updating eco points:", error);
    } else {
        console.log("Eco points updated successfully:", data);
    }
};

// Example usage
const handleTransaction = async (email, transactionAmount) => {
    const userId = await getUserIdByEmail(email);
    if (userId) {
        const points = calculateEcoPoints(transactionAmount);
        await updateEcoPointsBalance(userId, points);
    } else {
        console.log("User  not found");
    }
};
  
  // Function to redeem eco points for a reward
  const redeemEcoPoints = (userId, rewardId) => {
    // Get the user's current eco points balance
    const userEcoPoints = getUserEcoPointsBalance(userId);
  
    // Get the point value of the reward
    const rewardPointValue = getRewardPointValue(rewardId);
  
    // Check if the user has enough eco points to redeem the reward
    if (userEcoPoints >= rewardPointValue) {
      // Update the user's eco points balance
      updateEcoPointsBalance(userId, userEcoPoints - rewardPointValue);
  
      // Grant the reward to the user
      grantReward(userId, rewardId);
    } else {
      // Handle insufficient eco points error
    }
  };