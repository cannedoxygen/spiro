import React, { useState, useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import NFTCard from '../components/NFTCard';
import '../styles/components.css';

const Collection = () => {
  const [userNFTs, setUserNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

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
        <h1>Your Spirograph NFT Collection</h1>
        <p>View, share and send your mathematical masterpieces</p>
        <WalletConnect onConnect={handleWalletConnect} />
      </div>
      
      {sendStatus && (
        <div className={`status-message ${sendStatus.status}`}>
          {sendStatus.message}
        </div>
      )}
      
      <div className="collection-content">
        {!isWalletConnected ? (
          <div className="connect-prompt">
            <h2>Connect your wallet to view your collection</h2>
            <p>Your Spirograph NFTs will appear here once you connect your wallet.</p>
          </div>
        ) : isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading your NFT collection...</p>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="empty-collection">
            <h2>No NFTs found</h2>
            <p>You don't have any Spirograph NFTs in your collection yet.</p>
            <a href="/create" className="create-link">Create your first Spirograph NFT</a>
          </div>
        ) : (
          <div className="nft-grid">
            {userNFTs.map(nft => (
              <NFTCard
                key={nft.id}
                id={nft.id}
                image={`/api/placeholder/300/300?text=Spirograph%20%23${nft.id}`} // Placeholder
                animationFrames={nft.animationFrames}
                parameters={nft.params}
                mintDate={nft.mintDate}
                onShare={handleShareNFT}
                onSend={handleSendNFT}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="collection-info">
        <h2>About Your NFTs</h2>
        <p>Each Spirograph NFT contains:</p>
        <ul>
          <li><strong>Unique Parameters</strong> - Mathematical values that define your pattern</li>
          <li><strong>Animation Sequence</strong> - Watch your pattern draw itself</li>
          <li><strong>On-Chain Storage</strong> - Your NFT is securely stored on the blockchain</li>
        </ul>
        <p>You can share your NFTs on social media or send them directly to friends' wallets.</p>
      </div>
    </div>
  );
};

export default Collection;