import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../styles/components.css';

// ERC-721 token contract ABI (minimal for balance checking)
const TOKEN_ABI = [
  // balanceOf function to check token ownership
  "function balanceOf(address owner) view returns (uint256)",
  // name function to get token name
  "function name() view returns (string)",
  // symbol function to get token symbol
  "function symbol() view returns (string)"
];

// Replace with your actual token contract address on Base network
const TOKEN_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // REPLACE WITH REAL ADDRESS

// Base network configuration
const BASE_NETWORK = {
  chainId: "0x2105", // Hex for 8453 (Base Mainnet)
  chainName: 'Base',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org']
};

const WalletConnect = ({ onConnect }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [hasToken, setHasToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  // Check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    try {
      // Check if ethereum object exists (any provider)
      const { ethereum } = window;

      if (!ethereum) {
        console.log('No wallet found.');
        return;
      }
      
      console.log('Wallet provider found');
      
      // Check if we're already connected
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Found an authorized account:', account);
        setWalletAddress(account);
        await checkNetwork();
        await checkTokenOwnership(account);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError("Error connecting to wallet");
    }
  };

  // Check if we're on the correct network (Base)
  const checkNetwork = async () => {
    try {
      const { ethereum } = window;
      
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("Current Chain ID:", chainId);
      
      if (chainId !== BASE_NETWORK.chainId) {
        // Prompt user to switch to Base
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_NETWORK.chainId }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to the wallet
          if (switchError.code === 4902) {
            try {
              await ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [BASE_NETWORK],
              });
            } catch (addError) {
              console.error('Error adding Base network:', addError);
              setError("Failed to add Base network to your wallet");
            }
          } else {
            console.error('Error switching to Base network:', switchError);
            setError("Failed to switch to Base network");
          }
        }
      }
    } catch (error) {
      console.error('Error checking network:', error);
    }
  };

  // Connect to MetaMask
  const connectMetaMask = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setShowWalletOptions(false);
      
      // Check if MetaMask is installed
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        setError("MetaMask is not installed. Please install MetaMask first.");
        setIsConnecting(false);
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Connected to account:', account);
        setWalletAddress(account);
        
        // Check if we're on the right network
        await checkNetwork();
        
        // Check token ownership
        await checkTokenOwnership(account);
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      setError("Failed to connect to MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Phantom
  const connectPhantom = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setShowWalletOptions(false);
      
      // Check if Phantom is installed
      if (!window.phantom || !window.phantom.ethereum) {
        setError("Phantom is not installed. Please install Phantom wallet first.");
        setIsConnecting(false);
        return;
      }
      
      // Use Phantom provider
      const phantomProvider = window.phantom?.ethereum;
      
      // Request account access
      const accounts = await phantomProvider.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Connected to Phantom account:', account);
        setWalletAddress(account);
        
        // Check if we're on the right network (using the Phantom provider)
        const chainId = await phantomProvider.request({ method: 'eth_chainId' });
        if (chainId !== BASE_NETWORK.chainId) {
          // Add or switch to Base network
          try {
            await phantomProvider.request({
              method: 'wallet_addEthereumChain',
              params: [BASE_NETWORK],
            });
          } catch (error) {
            console.error('Error adding Base network to Phantom:', error);
            setError("Failed to add Base network to Phantom");
            setIsConnecting(false);
            return;
          }
        }
        
        // Check token ownership
        await checkTokenOwnership(account, phantomProvider);
      }
    } catch (error) {
      console.error('Error connecting to Phantom:', error);
      setError("Failed to connect to Phantom");
    } finally {
      setIsConnecting(false);
    }
  };

  // Connect to Coinbase Wallet
  const connectCoinbaseWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      setShowWalletOptions(false);
      
      // Check if Coinbase Wallet is installed
      if (!window.ethereum || !window.ethereum.isCoinbaseWallet) {
        setError("Coinbase Wallet is not installed. Please install Coinbase Wallet first.");
        setIsConnecting(false);
        return;
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log('Connected to Coinbase Wallet account:', account);
        setWalletAddress(account);
        
        // Check if we're on the right network
        await checkNetwork();
        
        // Check token ownership
        await checkTokenOwnership(account);
      }
    } catch (error) {
      console.error('Error connecting to Coinbase Wallet:', error);
      setError("Failed to connect to Coinbase Wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      setWalletAddress(null);
      setHasToken(false);
      setTokenInfo(null);
      onConnect(null, false);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Check if user owns required token
  const checkTokenOwnership = async (address, provider = window.ethereum) => {
    try {
      if (!provider) return false;

      const ethersProvider = new ethers.providers.Web3Provider(provider);
      const tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_ABI,
        ethersProvider
      );
      
      // Get token info
      try {
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        setTokenInfo({ name, symbol });
      } catch (error) {
        console.error('Error getting token info:', error);
        // Continue even if we can't get token info
      }
      
      // Check token balance
      const balance = await tokenContract.balanceOf(address);
      const ownsToken = balance.gt(0); // Greater than 0
      
      console.log(`Token ownership for ${address}: ${ownsToken ? 'Yes' : 'No'} (${balance.toString()} tokens)`);
      setHasToken(ownsToken);
      
      // Notify parent component
      onConnect(address, ownsToken);
      
      return ownsToken;
    } catch (error) {
      console.error('Error checking token ownership:', error);
      
      // For development/testing only: simulate token ownership with 70% chance
      // Remove this in production!
      const simulateOwnership = Math.random() > 0.3;
      setHasToken(simulateOwnership);
      onConnect(address, simulateOwnership);
      
      return simulateOwnership;
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
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Detect what type of wallet is connected (for display purposes)
  const getWalletType = () => {
    const { ethereum } = window;
    
    if (!ethereum) return 'Wallet';
    
    if (ethereum.isPhantom) return 'Phantom';
    if (ethereum.isMetaMask) return 'MetaMask';
    if (ethereum.isCoinbaseWallet) return 'Coinbase Wallet';
    
    return 'Wallet';
  };

  // Toggle wallet options
  const toggleWalletOptions = () => {
    setShowWalletOptions(!showWalletOptions);
    setError(null);
  };

  return (
    <div className="wallet-connect">
      {!walletAddress ? (
        <div className="wallet-connect-container">
          <button 
            className="connect-button"
            onClick={toggleWalletOptions}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          {showWalletOptions && (
            <div className="wallet-options">
              <button onClick={connectMetaMask} className="wallet-option">
                <img src="/images/metamask.png" alt="MetaMask" className="wallet-icon" />
                MetaMask
              </button>
              <button onClick={connectPhantom} className="wallet-option">
                <img src="/images/phantom.png" alt="Phantom" className="wallet-icon" />
                Phantom
              </button>
              <button onClick={connectCoinbaseWallet} className="wallet-option">
                <img src="/images/coinbase.png" alt="Coinbase Wallet" className="wallet-icon" />
                Coinbase Wallet
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="wallet-info">
          <div className="address-display">
            <span className="address-label">{getWalletType()}:</span>
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
          <a href="https://opensea.io/collection/spyro-access-token" target="_blank" rel="noopener noreferrer" className="get-token-link">Get Token</a>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;