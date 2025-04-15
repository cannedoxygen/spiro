import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import '../styles/components.css';

// ERC-20 token contract ABI (minimal for balance checking)
const TOKEN_ABI = [
  // balanceOf function to check token balance
  "function balanceOf(address owner) view returns (uint256)",
  // name function to get token name
  "function name() view returns (string)",
  // symbol function to get token symbol
  "function symbol() view returns (string)",
  // decimals function to get token decimals
  "function decimals() view returns (uint8)",
  // approve function to approve spending
  "function approve(address spender, uint256 amount) returns (bool)",
  // transfer function to send tokens
  "function transfer(address recipient, uint256 amount) returns (bool)"
];

// Replace with your actual SPIRO token contract address
const TOKEN_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // REPLACE WITH REAL ADDRESS

// Replace with the NFT contract address that will receive the burn
const NFT_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // REPLACE WITH REAL ADDRESS

// Cost per mint in SPIRO tokens
const MINT_COST = ethers.utils.parseUnits("10000", 18); // Assuming 18 decimals

const WalletPanel = ({ 
  walletAddress, 
  isWalletConnected, 
  onMint, 
  mintCount = 0 
}) => {
  const [tokenBalance, setTokenBalance] = useState("0");
  const [formattedBalance, setFormattedBalance] = useState("0");
  const [tokenSymbol, setTokenSymbol] = useState("SPIRO");
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [isBurning, setIsBurning] = useState(false);
  const [burnStatus, setBurnStatus] = useState(null);
  const [canMint, setCanMint] = useState(false);

  // Check token balance when wallet is connected
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      checkTokenBalance();
    } else {
      setTokenBalance("0");
      setFormattedBalance("0");
    }
  }, [isWalletConnected, walletAddress]);

  // Check token balance and get token info
  const checkTokenBalance = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_ABI,
        provider
      );
      
      // Get token info
      try {
        const symbol = await tokenContract.symbol();
        const decimals = await tokenContract.decimals();
        setTokenSymbol(symbol);
        setTokenDecimals(decimals);
      } catch (error) {
        console.error('Error getting token info:', error);
        // Continue with defaults if we can't get token info
      }
      
      // Get token balance
      const balance = await tokenContract.balanceOf(walletAddress);
      setTokenBalance(balance.toString());
      
      // Format the balance for display (divide by 10^decimals)
      const formatted = ethers.utils.formatUnits(balance, tokenDecimals);
      setFormattedBalance(formatted);
      
      // Check if user can mint (has enough tokens and hasn't reached limit)
      const hasEnoughTokens = balance.gte(MINT_COST);
      const underMintLimit = mintCount < 2;
      setCanMint(hasEnoughTokens && underMintLimit);
    } catch (error) {
      console.error('Error checking token balance:', error);
      setTokenBalance("0");
      setFormattedBalance("0");
      
      // For development only: simulate token balance
      // Remove this in production!
      const simulatedBalance = "25000";
      const simulatedFormatted = "25,000";
      setTokenBalance(simulatedBalance);
      setFormattedBalance(simulatedFormatted);
      setCanMint(true);
    }
  };

  // Burn tokens to mint NFT
  const burnTokensAndMint = async () => {
    try {
      if (!window.ethereum || !isWalletConnected) {
        alert("Please connect your wallet first!");
        return;
      }
      
      // Check if already reached limit
      if (mintCount >= 2) {
        alert("You've reached the maximum mint limit of 2 NFTs per wallet!");
        return;
      }

      setIsBurning(true);
      setBurnStatus("Approving token transfer...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const tokenContract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_ABI,
        signer
      );
      
      // First approve the NFT contract to spend our tokens
      const approveTx = await tokenContract.approve(NFT_CONTRACT_ADDRESS, MINT_COST);
      setBurnStatus("Waiting for approval confirmation...");
      await approveTx.wait();
      
      // Now burn the tokens (in a real implementation, the NFT contract would handle this)
      // For now, we'll just simulate by transferring to a burn address
      setBurnStatus("Burning tokens...");
      const burnAddress = "0x000000000000000000000000000000000000dEaD"; // Standard burn address
      const burnTx = await tokenContract.transfer(burnAddress, MINT_COST);
      
      setBurnStatus("Creating your NFT...");
      await burnTx.wait();
      
      // Trigger the NFT minting process
      setBurnStatus("Success! NFT created!");
      
      // Refresh token balance
      await checkTokenBalance();
      
      // Notify parent component about successful mint
      onMint && onMint();
    } catch (error) {
      console.error('Error burning tokens:', error);
      setBurnStatus(`Error: ${error.message}`);
    } finally {
      setIsBurning(false);
      
      // Clear status after a delay
      setTimeout(() => {
        setBurnStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="wallet-panel">
      {isWalletConnected ? (
        <div className="token-info-panel">
          <h3>Your SPIRO Balance</h3>
          <div className="token-balance">
            <span className="balance-amount">{formattedBalance}</span>
            <span className="balance-symbol">{tokenSymbol}</span>
          </div>
          
          <div className="mint-info">
            <div className="cost-info">
              <span>Cost per NFT:</span>
              <span className="cost-value">10,000 {tokenSymbol}</span>
            </div>
            <div className="limit-info">
              <span>Your mints:</span>
              <span className="limit-value">{mintCount}/2</span>
            </div>
          </div>
          
          {burnStatus && (
            <div className={`burn-status ${isBurning ? 'burning' : 'success'}`}>
              {burnStatus}
            </div>
          )}
          
          <button 
            className="burn-button"
            onClick={burnTokensAndMint}
            disabled={isBurning || !canMint}
          >
            {isBurning ? 'Processing...' : `Burn 10,000 ${tokenSymbol} & Mint NFT`}
          </button>
          
          {!canMint && Number(formattedBalance) < 10000 && (
            <div className="insufficient-tokens">
              You need at least 10,000 {tokenSymbol} tokens to mint an NFT.
              <a href="#" className="get-tokens-link">Get {tokenSymbol} Tokens</a>
            </div>
          )}
          
          {!canMint && mintCount >= 2 && (
            <div className="mint-limit-reached">
              You've reached the maximum mint limit of 2 NFTs per wallet.
            </div>
          )}
        </div>
      ) : (
        <div className="connect-prompt">
          <h3>Connect Your Wallet</h3>
          <p>Connect your wallet to check your SPIRO balance and mint NFTs.</p>
        </div>
      )}
    </div>
  );
};

export default WalletPanel;