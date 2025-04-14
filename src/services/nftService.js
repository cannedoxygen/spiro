// src/services/nftService.js

// Get the set of minted seeds
export const getMintedSeeds = () => {
  try {
    const mintedSeeds = JSON.parse(localStorage.getItem('mintedSeeds')) || [];
    return new Set(mintedSeeds);
  } catch (error) {
    console.error('Error loading minted seeds:', error);
    return new Set();
  }
};

// Check if a seed is available
export const isSeedAvailable = (seed) => {
  const mintedSeeds = getMintedSeeds();
  return !mintedSeeds.has(seed);
};

// Reserve a seed (mark it as minted)
export const reserveSeed = (seed) => {
  try {
    const mintedSeeds = Array.from(getMintedSeeds());
    
    // Check if we've reached the limit
    if (mintedSeeds.length >= 10000) {
      return { success: false, message: "All 10,000 designs have been minted!" };
    }
    
    // Check if the seed is already minted
    if (mintedSeeds.includes(seed)) {
      return { success: false, message: "This design has already been minted!" };
    }
    
    // Add the seed to the minted list
    mintedSeeds.push(seed);
    localStorage.setItem('mintedSeeds', JSON.stringify(mintedSeeds));
    
    return { success: true };
  } catch (error) {
    console.error('Error reserving seed:', error);
    return { success: false, message: "Error reserving seed" };
  }
};

// Get the count of minted NFTs
export const getMintedCount = () => {
  const mintedSeeds = getMintedSeeds();
  return mintedSeeds.size;
};

// Find an available seed
export const findAvailableSeed = () => {
  const mintedSeeds = getMintedSeeds();
  
  // If all 10,000 are minted, return null
  if (mintedSeeds.size >= 10000) {
    return null;
  }
  
  // Try to find an available seed
  let attempts = 0;
  while (attempts < 100) {
    const randomSeed = Math.floor(Math.random() * 10000) + 1;
    if (!mintedSeeds.has(randomSeed)) {
      return randomSeed;
    }
    attempts++;
  }
  
  // If we couldn't find a random one, search sequentially
  for (let i = 1; i <= 10000; i++) {
    if (!mintedSeeds.has(i)) {
      return i;
    }
  }
  
  return null; // Should never reach here if we check size first
};

// Get user's minted NFTs
export const getUserNFTs = () => {
  try {
    return JSON.parse(localStorage.getItem('userNFTs')) || [];
  } catch (error) {
    console.error('Error loading user NFTs:', error);
    return [];
  }
};

// Save an NFT to the user's collection
export const saveUserNFT = (nftData) => {
  try {
    const userNFTs = getUserNFTs();
    userNFTs.push(nftData);
    localStorage.setItem('userNFTs', JSON.stringify(userNFTs));
    return true;
  } catch (error) {
    console.error('Error saving NFT:', error);
    return false;
  }
};