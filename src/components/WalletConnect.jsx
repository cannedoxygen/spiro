import React, { useState, useEffect } from 'react';
import '../styles/components.css';

const WalletConnect = ({ onConnect }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if Phantom wallet is installed
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana && solana.isPhantom) {
        console.log('Phantom wallet found!');
        
        // If the wallet is already connected, set the address
        if (solana.isConnected) {
          const response = await solana.connect({ onlyIfTrusted: true });
          const address = response.publicKey.toString();
          setWalletAddress(address);
          await checkTokenOwnership(address);
        }
      } else {
        setError("Phantom wallet not found. Please install it!");
        console.error('Phantom wallet not found!');
      }
    } catch (error) {
      console.error(error);
      setError("Error connecting to wallet");
    }
  };

  // Connect to Phantom wallet
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const { solana } = window;
      
      if (solana) {
        const response = await solana.connect();
        const address = response.publicKey.toString();
        console.log('Connected with address:', address);
        
        setWalletAddress(address);
        await checkTokenOwnership(address);
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      setError("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      const { solana } = window;
      
      if (solana) {
        await solana.disconnect();
        setWalletAddress(null);
        setHasToken(false);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Check if user owns required token
  const checkTokenOwnership = async (address) => {
    try {
      // In a real implementation, this would query the blockchain
      // For this demo, we'll simulate token ownership
      const simulateOwnership = Math.random() > 0.3; // 70% chance of having token
      
      setHasToken(simulateOwnership);
      
      if (simulateOwnership) {
        onConnect(address, true);
      } else {
        onConnect(address, false);
      }
      
      return simulateOwnership;
    } catch (error) {
      console.error('Error checking token ownership:', error);
      return false;
    }
  };

  // Check wallet connection on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="wallet-connect">
      {!walletAddress ? (
        <button 
          className="connect-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Phantom Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="address-display">
            <span className="address-label">Connected:</span>
            <span className="address-value">{formatAddress(walletAddress)}</span>
            {hasToken && <span className="token-badge">✓ Token Verified</span>}
          </div>
          <button 
            className="disconnect-button"
            onClick={disconnectWallet}
          >
            Disconnect
          </button>
        </div>
      )}
      
      {error && <div className="wallet-error">{error}</div>}
      
      {walletAddress && !hasToken && (
        <div className="token-warning">
          You need the gate token to mint NFTs for free.
          <a href="#" className="get-token-link">Get Token</a>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;