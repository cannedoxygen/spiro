import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../components/WalletConnect';
import NFTCard from '../components/NFTCard';
import '../styles/components.css';

const Collection = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [mintedCount, setMintedCount] = useState(0);
  const [collectionValue, setCollectionValue] = useState(0);

  // Handle wallet connection
  const handleWalletConnect = (address, tokenOwnership) => {
    setWalletAddress(address);
    setIsWalletConnected(!!address);
    
    if (address) {
      fetchUserNFTs(address);
    } else {
      setUserNFTs([]);
    }
  };

  // Fetch NFTs owned by the user
  const fetchUserNFTs = async (address) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would query blockchain or API
      // For this demo, we'll simulate with localStorage
      const storedNFTs = JSON.parse(localStorage.getItem('userNFTs')) || [];
      
      // Wait a bit to simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserNFTs(storedNFTs);
      setMintedCount(storedNFTs.length);
      
      // Calculate collection value (10,000 SPIRO tokens per NFT)
      setCollectionValue(storedNFTs.length * 10000);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending NFT to another wallet
  const handleSendNFT = async (nftId, recipientAddress) => {
    try {
      setSendStatus({ status: 'sending', message: 'Sending NFT...' });
      
      // Simulate sending process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local storage to simulate the transfer
      const updatedNFTs = userNFTs.filter(nft => nft.id !== nftId);
      localStorage.setItem('userNFTs', JSON.stringify(updatedNFTs));
      setUserNFTs(updatedNFTs);
      setMintedCount(updatedNFTs.length);
      setCollectionValue(updatedNFTs.length * 10000);
      
      setSendStatus({ 
        status: 'success', 
        message: `NFT #${nftId} successfully sent to ${recipientAddress.substring(0, 6)}...${recipientAddress.substring(recipientAddress.length - 4)}` 
      });
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSendStatus(null);
      }, 5000);
      
    } catch (error) {
      console.error('Error sending NFT:', error);
      setSendStatus({ status: 'error', message: 'Error sending NFT. Please try again.' });
      
      // Clear error message after a few seconds
      setTimeout(() => {
        setSendStatus(null);
      }, 5000);
    }
  };

  // Handle sharing NFT on social media
  const handleShareNFT = (nftId) => {
    // This function would be called by the NFTCard component
    console.log(`Sharing NFT #${nftId}`);
  };

  return (
    <div className="collection-page">
      <div className="collection-header">
        <h1>Your Spirograph Collection</h1>
        <p>View, share and manage your mathematical masterpieces</p>
      </div>
      
      <div className="collection-stats-bar">
        <div className="wallet-section">
          <WalletConnect onConnect={handleWalletConnect} />
        </div>
        
        {isWalletConnected && (
          <div className="stats-section">
            <div className="stat-item">
              <span className="stat-label">Collection Size</span>
              <span className="stat-value">{mintedCount} NFTs</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">SPIRO Value</span>
              <span className="stat-value">{collectionValue.toLocaleString()} SPIRO</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mint Limit</span>
              <span className="stat-value">{mintedCount}/2</span>
            </div>
          </div>
        )}
      </div>
      
      {sendStatus && (
        <div className={`status-message ${sendStatus.status}`}>
          {sendStatus.message}
        </div>
      )}
      
      <div className="collection-content">
        {!isWalletConnected ? (
          <div className="connect-prompt">
            <div className="connect-prompt-image">
              <div className="preview-image-container">
                <img src="/images/placeholder_spirograph.png" alt="Spirograph placeholder" className="preview-image" />
              </div>
            </div>
            <h2>Connect Your Wallet</h2>
            <p>Connect your wallet to view your Spirograph NFT collection</p>
            <p className="secondary-text">Your creations will appear here once you connect</p>
          </div>
        ) : isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading your collection...</p>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="empty-collection">
            <div className="empty-collection-image">
              <div className="preview-image-container">
                <img src="/images/empty_collection.png" alt="Empty collection" className="preview-image" />
              </div>
            </div>
            <h2>No Spirographs Found</h2>
            <p>You don't have any Spirograph NFTs in your collection yet</p>
            <Link to="/create" className="create-link">Create Your First Spirograph</Link>
          </div>
        ) : (
          <>
            <div className="collection-actions">
              <Link to="/create" className="btn-primary">Create New Spirograph</Link>
              <button className="btn-secondary">Sort By Rarity</button>
            </div>
            
            <div className="nft-grid">
              {userNFTs.map(nft => (
                <NFTCard
                  key={nft.id}
                  id={nft.id}
                  image={nft.imageUrl || `/api/placeholder/300/300?text=Spirograph%20%23${nft.id}`}
                  animationFrames={nft.animationFrames}
                  parameters={nft.params}
                  mintDate={nft.mintDate}
                  onShare={handleShareNFT}
                  onSend={handleSendNFT}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      {isWalletConnected && userNFTs.length > 0 && (
        <div className="reward-reminder-panel">
          <div className="reward-reminder-content">
            <h3>SPIRO Token Rewards Coming Soon!</h3>
            <p>After 90 days from launch, you'll receive SPIRO tokens based on your NFT rarity</p>
            <div className="reward-multipliers">
              <div className="multiplier-item">
                <span className="rarity common">Common</span>
                <span>1×</span>
              </div>
              <div className="multiplier-item">
                <span className="rarity uncommon">Uncommon</span>
                <span>1.5×</span>
              </div>
              <div className="multiplier-item">
                <span className="rarity rare">Rare</span>
                <span>2×</span>
              </div>
              <div className="multiplier-item">
                <span className="rarity super-rare">Super Rare</span>
                <span>3×</span>
              </div>
              <div className="multiplier-item">
                <span className="rarity legendary">Legendary</span>
                <span>5×</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;