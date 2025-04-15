// src/services/nftService.js
import { ethers } from 'ethers';

// Replace with your actual NFT contract address on Base network
const NFT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // REPLACE WITH REAL ADDRESS

// Simplified ABI for NFT contract
const NFT_ABI = [
  // Function to check if a token ID exists
  "function exists(uint256 tokenId) view returns (bool)",
  
  // Function to mint a new NFT
  "function mint(uint256 tokenId) external",
  
  // Function to get token count
  "function totalSupply() view returns (uint256)",
  
  // Function to get tokens owned by an address
  "function tokensOfOwner(address owner) view returns (uint256[])",
  
  // Function to get token metadata URI
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Get the provider
const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  // Fallback to a read-only provider if no wallet connected
  return new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
};

// Get signer for transactions
const getSigner = async () => {
  if (!window.ethereum) {
    throw new Error("No ethereum object found. Please install MetaMask.");
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

// Check if a token ID is already minted
export const isSeedAvailable = async (seed) => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS, 
      NFT_ABI,
      provider
    );
    
    // Check if the token exists
    const exists = await contract.exists(seed);
    return !exists;
  } catch (error) {
    console.error('Error checking if seed is available:', error);
    // For graceful degradation in case of RPC issues
    return true;
  }
};

// Get the count of minted NFTs
export const getMintedCount = async () => {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS, 
      NFT_ABI,
      provider
    );
    
    const totalSupply = await contract.totalSupply();
    return totalSupply.toNumber();
  } catch (error) {
    console.error('Error getting minted count:', error);
    // For graceful degradation, use localStorage as fallback
    try {
      const mintedSeeds = JSON.parse(localStorage.getItem('mintedSeeds')) || [];
      return mintedSeeds.length;
    } catch {
      return 0;
    }
  }
};

// Find an available seed
export const findAvailableSeed = async () => {
  try {
    // Generate a random seed between 1 and 10000
    const randomSeed = Math.floor(Math.random() * 10000) + 1;
    
    // Check if this seed is available
    const available = await isSeedAvailable(randomSeed);
    if (available) {
      return randomSeed;
    }
    
    // If not available, try a sequential search for an available seed
    for (let i = 1; i <= 10000; i++) {
      const isAvailable = await isSeedAvailable(i);
      if (isAvailable) {
        return i;
      }
    }
    
    // If all 10,000 tokens are minted, return null
    return null;
  } catch (error) {
    console.error('Error finding available seed:', error);
    // Fallback to a random number if there's an issue
    return Math.floor(Math.random() * 10000) + 1;
  }
};

// Reserve a seed (mint the token)
export const reserveSeed = async (seed) => {
  try {
    // Check if the seed is available first
    const available = await isSeedAvailable(seed);
    if (!available) {
      return { success: false, message: "This design has already been minted!" };
    }
    
    const signer = await getSigner();
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS, 
      NFT_ABI,
      signer
    );
    
    // Mint the token
    const tx = await contract.mint(seed);
    
    // Wait for the transaction to be confirmed
    await tx.wait();
    
    // Also save locally for immediate UI updates
    try {
      const mintedSeeds = JSON.parse(localStorage.getItem('mintedSeeds')) || [];
      mintedSeeds.push(seed);
      localStorage.setItem('mintedSeeds', JSON.stringify(mintedSeeds));
    } catch (e) {
      console.error('Error updating local storage:', e);
    }
    
    return { success: true, transaction: tx.hash };
  } catch (error) {
    console.error('Error reserving seed:', error);
    return { success: false, message: error.message || "Error minting NFT" };
  }
};

// Get user's minted NFTs
export const getUserNFTs = async (walletAddress) => {
  try {
    if (!walletAddress) {
      throw new Error("Wallet address is required");
    }
    
    const provider = getProvider();
    const contract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS, 
      NFT_ABI,
      provider
    );
    
    // Get token IDs owned by the user
    const tokenIds = await contract.tokensOfOwner(walletAddress);
    
    // Get metadata for each token
    const nfts = await Promise.all(tokenIds.map(async (id) => {
      const tokenId = id.toNumber();
      const uri = await contract.tokenURI(tokenId);
      
      // If URI is IPFS, format properly
      let metadataUrl = uri;
      if (uri.startsWith('ipfs://')) {
        metadataUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }
      
      // Fetch metadata
      try {
        const response = await fetch(metadataUrl);
        const metadata = await response.json();
        
        return {
          id: tokenId,
          name: metadata.name || `Spirograph #${tokenId}`,
          image: metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '',
          params: metadata.attributes?.reduce((acc, attr) => {
            acc[attr.trait_type.toLowerCase()] = attr.value;
            return acc;
          }, {}) || {},
          mintDate: new Date().toISOString() // NFT contracts typically don't store mint date
        };
      } catch (error) {
        console.error(`Error fetching metadata for token ${tokenId}:`, error);
        return {
          id: tokenId,
          name: `Spirograph #${tokenId}`,
          image: '',
          params: {},
          mintDate: new Date().toISOString()
        };
      }
    }));
    
    return nfts;
  } catch (error) {
    console.error('Error getting user NFTs:', error);
    
    // For graceful degradation, fall back to local storage
    try {
      return JSON.parse(localStorage.getItem('userNFTs')) || [];
    } catch (e) {
      return [];
    }
  }
};

// Save an NFT to IPFS and mint it
export const saveUserNFT = async (nftData) => {
  try {
    // In a real implementation, you would:
    // 1. Upload the image to IPFS
    // 2. Create metadata and upload to IPFS
    // 3. Call the contract to mint with the IPFS URI
    
    // For now, we'll just save to localStorage as a fallback
    const userNFTs = JSON.parse(localStorage.getItem('userNFTs')) || [];
    userNFTs.push(nftData);
    localStorage.setItem('userNFTs', JSON.stringify(userNFTs));
    
    return true;
  } catch (error) {
    console.error('Error saving NFT:', error);
    return false;
  }
};

// Helper for collection page
export const formatCollectionData = (nfts) => {
  return nfts.map(nft => ({
    id: nft.id,
    image: nft.image,
    params: nft.params,
    mintDate: nft.mintDate
  }));
};