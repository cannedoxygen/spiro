import React, { useState, useEffect } from 'react';
import SpiroCanvas from '../components/SpiroCanvas';
import WalletConnect from '../components/WalletConnect';
import { 
  isSeedAvailable, 
  reserveSeed, 
  getMintedCount,
  findAvailableSeed,
  saveUserNFT
} from '../services/nftService';
import '../styles/components.css';

const Create = () => {
  // Spirograph state
  const [seed, setSeed] = useState(null);
  const [shape, setShape] = useState(null);
  const [palette, setPalette] = useState(null);
  const [image, setImage] = useState(null);
  const [animatedGif, setAnimatedGif] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [strokeWeight] = useState(1); // Fixed to 1 per request
  
  // NFT and wallet state
  const [isMinting, setIsMinting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [mintStatus, setMintStatus] = useState(null); // 'success', 'error', or null
  const [mintedCount, setMintedCount] = useState(0);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  // Check NFT availability on load
  useEffect(() => {
    setMintedCount(getMintedCount());
  }, []);

  // Check seed availability when it changes
  useEffect(() => {
    if (seed) {
      const available = isSeedAvailable(seed);
      if (!available) {
        setAvailabilityMessage('This design has already been minted! Generate a new one.');
      } else {
        setAvailabilityMessage('');
      }
    }
  }, [seed]);

  // Handle wallet connection
  const handleWalletConnect = (address, tokenOwnership) => {
    setWalletAddress(address);
    setIsWalletConnected(!!address);
    setHasToken(tokenOwnership);
  };

  // Handle shape change
  const handleShapeChange = (shapeData) => {
    setShape(shapeData);
  };

  // Handle palette change
  const handlePaletteChange = (paletteData) => {
    setPalette(paletteData);
  };

  // Create a GIF from frames (simplified version)
  const createGifFromFrames = async (frames) => {
    // In a real implementation, we would use a library like gif.js
    // For this demo, we'll simulate creating a GIF by using the first frame
    // You would need to add gif.js to the project for full implementation
    return frames[0].canvas.toDataURL();
  };

  // Handle drawing completion
  const handleDrawingComplete = async (finalImage, animatedFrames) => {
    // Store the final image
    setImage(finalImage);
    
    // Convert frames to GIF if we have frames
    if (animatedFrames && animatedFrames.length > 0) {
      try {
        // Create a GIF from the frames (in a real implementation)
        const gifUrl = await createGifFromFrames(animatedFrames);
        setAnimatedGif(gifUrl);
        
        // Show preview with the rotating GIF
        setShowPreview(true);
      } catch (error) {
        console.error("Error creating GIF:", error);
      }
    }
  };

  // Generate a new random design
  const handleGenerateNew = () => {
    // Clear previous state
    setImage(null);
    setAnimatedGif(null);
    setShowPreview(false);
    setMintStatus(null);
    setAvailabilityMessage('');
    
    // Find an available seed
    const newSeed = findAvailableSeed();
    
    if (newSeed) {
      setSeed(newSeed);
    } else {
      setAvailabilityMessage('All 10,000 designs have been minted!');
    }
  };

  // Mint the current design as an NFT
  const handleMint = async () => {
    // Can't mint without wallet or token
    if (!isWalletConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!hasToken) {
      alert("You need the special token to mint for free!");
      return;
    }

    // Ensure we have a completed drawing and animation
    if (!image || !animatedGif) {
      alert("Please wait for the drawing and animation to complete before minting.");
      return;
    }
    
    // Check availability
    if (!isSeedAvailable(seed)) {
      setAvailabilityMessage('This design has already been minted! Generate a new one.');
      return;
    }

    try {
      setIsMinting(true);
      setMintStatus(null);

      // Reserve the seed
      const reservationResult = reserveSeed(seed);
      
      if (!reservationResult.success) {
        throw new Error(reservationResult.message);
      }
      
      // In a real implementation, this would upload to IPFS and mint an NFT
      console.log("Minting with parameters:", {
        seed,
        shape: shape?.type,
        rarity: shape?.rarity,
        palette: palette?.name,
        animated: true // This is now always an animated NFT
      });

      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success!
      setMintStatus('success');
      setMintedCount(getMintedCount());
      
      // Store in local storage for collection page
      saveUserNFT({
        id: seed,
        params: {
          shape: shape?.type,
          rarity: shape?.rarity,
          fixedRadius: shape?.params?.R,
          movingRadius: shape?.params?.r1,
          offset: shape?.params?.d,
          colors: palette?.colors,
          strokeWeight: strokeWeight
        },
        imageUrl: image?.canvas?.toDataURL?.() || null,
        animatedGifUrl: animatedGif, // Store the animated GIF URL
        mintDate: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMintStatus('error');
      setAvailabilityMessage(error.message || 'Error minting NFT');
    } finally {
      setIsMinting(false);
    }
  };

  // Download the current GIF
  const handleDownloadGif = () => {
    if (animatedGif) {
      const link = document.createElement('a');
      link.href = animatedGif;
      link.download = `Spirograph_${seed}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="create-page">
      <div className="create-header">
        <h1>Create Your Spirograph NFT</h1>
        <p>Design your unique mathematical pattern and mint it as an animated NFT</p>
        <div className="nft-availability">
          <span className="minted-count">{mintedCount}/10,000 Minted</span>
          <WalletConnect onConnect={handleWalletConnect} />
        </div>
      </div>

      <div className="create-container">
        <div className="canvas-section">
          {!showPreview ? (
            <SpiroCanvas
              seed={seed}
              setSeed={setSeed}
              onShapeChange={handleShapeChange}
              onPaletteChange={handlePaletteChange}
              onDrawingComplete={handleDrawingComplete}
            />
          ) : (
            <div className="preview-container">
              <h3>Your Animated Spirograph</h3>
              <div className="animation-preview">
                <img src={animatedGif} alt="Animated Spirograph" className="preview-gif" />
              </div>
              <div className="preview-actions">
                <button onClick={handleDownloadGif} className="btn-secondary">Download GIF</button>
                <button 
                  onClick={handleMint}
                  className="btn-primary"
                  disabled={isMinting || !isSeedAvailable(seed)}
                >
                  {isMinting ? 'Minting...' : 'Mint as NFT'}
                </button>
              </div>
            </div>
          )}
          
          {mintStatus === 'success' && (
            <div className="mint-success">
              <h3>Success! 🎉</h3>
              <p>Your Spirograph NFT has been minted and sent to your wallet.</p>
              <p>Share your creation with friends!</p>
              <div className="share-buttons">
                <button className="share-twitter">Share on X</button>
                <button className="share-copy">Copy Link</button>
              </div>
              <button onClick={handleGenerateNew} className="btn-primary mt-3">Create Another</button>
            </div>
          )}
          
          {mintStatus === 'error' && (
            <div className="mint-error">
              <h3>Error Minting</h3>
              <p>There was a problem creating your NFT. Please try again.</p>
              <button onClick={() => setMintStatus(null)} className="btn-secondary mt-2">Try Again</button>
            </div>
          )}
        </div>
        
        <div className="controls-section">
          <div className="spirograph-info">
            {seed && (
              <>
                <h3>Your Spirograph</h3>
                <p><strong>Seed:</strong> #{seed}</p>
                {shape && (
                  <p><strong>Shape:</strong> {shape.type} ({shape.rarity})</p>
                )}
                {palette && (
                  <p><strong>Palette:</strong> {palette.name} ({palette.rarity})</p>
                )}
                
                {availabilityMessage && (
                  <p className="availability-message">{availabilityMessage}</p>
                )}
              </>
            )}
          </div>
          
          <div className="action-buttons">
            <button 
              className="btn-primary" 
              onClick={handleGenerateNew}
              disabled={isMinting}
            >
              Generate New Design
            </button>
          </div>
          
          <div className="token-gate-info">
            <h3>Token Gate</h3>
            <p>This is a token-gated experience. You need to own our special token to mint NFTs for free.</p>
            {!isWalletConnected && (
              <p>Connect your wallet to check if you have the token.</p>
            )}
            {isWalletConnected && !hasToken && (
              <div>
                <p>You don't have the required token yet.</p>
                <button className="get-token-button">Get Token</button>
              </div>
            )}
            {isWalletConnected && hasToken && (
              <p className="token-success">You have the token! Mint as many NFTs as you want.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;