import React, { useState, useEffect } from 'react';
import WalletConnect from '../components/WalletConnect';
import SpirographCanvas from '../components/SpirographCanvas';
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
  const [showPreview, setShowPreview] = useState(false);
  
  // NFT and wallet state
  const [isMinting, setIsMinting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [mintStatus, setMintStatus] = useState(null);
  const [mintedCount, setMintedCount] = useState(0);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isSeedAvailableState, setIsSeedAvailableState] = useState(true);

  // Check NFT availability on load
  useEffect(() => {
    const fetchMintedCount = async () => {
      try {
        const count = await getMintedCount();
        setMintedCount(count);
      } catch (error) {
        console.error("Error fetching minted count:", error);
        setMintedCount(0);
      }
    };

    fetchMintedCount();
    handleGenerateNew();
  }, []);

  // Check seed availability when it changes
  useEffect(() => {
    if (seed) {
      const checkSeedAvailability = async () => {
        try {
          const available = await isSeedAvailable(seed);
          setIsSeedAvailableState(available);
          
          if (!available) {
            setAvailabilityMessage('This design has already been minted! Generate a new one.');
          } else {
            setAvailabilityMessage('');
          }
        } catch (error) {
          console.error("Error checking seed availability:", error);
          setIsSeedAvailableState(true);
          setAvailabilityMessage('');
        }
      };

      checkSeedAvailability();
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

  // Handle drawing completion
  const handleDrawingComplete = (finalImage) => {
    setImage(finalImage);
    setShowPreview(true);
  };

  // Generate a new random design
  const handleGenerateNew = async () => {
    // Clear previous state
    setImage(null);
    setShowPreview(false);
    setMintStatus(null);
    setAvailabilityMessage('');
    
    try {
      // Find an available seed
      const newSeed = await findAvailableSeed();
      
      if (newSeed) {
        setSeed(newSeed);
      } else {
        setAvailabilityMessage('All 10,000 designs have been minted!');
      }
    } catch (error) {
      console.error("Error finding available seed:", error);
      // Fallback to a random seed (1-10000) if there's an error
      setSeed(Math.floor(Math.random() * 10000) + 1);
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

    // Ensure we have a completed drawing
    if (!image) {
      alert("Please wait for the drawing to complete before minting.");
      return;
    }
    
    // Check availability once more before minting
    try {
      const available = await isSeedAvailable(seed);
      if (!available) {
        setAvailabilityMessage('This design has already been minted! Generate a new one.');
        return;
      }
    } catch (error) {
      console.error("Error checking seed availability:", error);
    }

    try {
      setIsMinting(true);
      setMintStatus(null);

      // Reserve the seed
      const reservationResult = await reserveSeed(seed);
      
      if (!reservationResult.success) {
        throw new Error(reservationResult.message);
      }
      
      // In a real implementation, this would upload to IPFS and mint an NFT
      console.log("Minting with parameters:", {
        seed,
        shape: shape?.type,
        rarity: shape?.rarity,
        palette: palette?.name,
        animated: true
      });

      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success!
      setMintStatus('success');
      
      // Update minted count
      try {
        const count = await getMintedCount();
        setMintedCount(count);
      } catch (error) {
        console.error("Error fetching minted count:", error);
      }
      
      // Store in local storage for collection page
      const imageUrl = image && image.canvas ? image.canvas.toDataURL('image/png') : null;
      
      await saveUserNFT({
        id: seed,
        params: {
          shape: shape?.type,
          rarity: shape?.rarity,
          fixedRadius: shape?.params?.R,
          movingRadius: shape?.params?.r1,
          offset: shape?.params?.d,
          colors: palette?.colors,
          strokeWeight: 1
        },
        imageUrl: imageUrl,
        animatedGifUrl: imageUrl,
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

  // Download the current image
  const handleDownloadImage = () => {
    if (image && image.canvas) {
      const link = document.createElement('a');
      link.href = image.canvas.toDataURL('image/png');
      link.download = `Spyro_${seed}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="create-page">
      <div className="create-header">
        <h1>Create Your Spyro NFT</h1>
        <p>Design your unique mathematical pattern and mint it as an animated NFT</p>
        <div className="nft-availability">
          <span className="minted-count">{mintedCount}/10,000 Minted</span>
          <WalletConnect onConnect={handleWalletConnect} />
        </div>
      </div>

      <div className="create-container">
        <div className="canvas-side">
          {/* Spirograph Information */}
          <div className="spiro-info">
            {seed && (
              <div className="spiro-title">
                <h2>Spyro #{seed}</h2>
                {shape && palette && (
                  <div className="spiro-properties">
                    <span className="shape-badge">
                      <span className="prop-icon">🌟</span> {shape.type} · {shape.rarity}
                    </span>
                    <span className="palette-badge">
                      <span className="prop-icon">🎨</span> {palette.name} · {palette.rarity}
                    </span>
                  </div>
                )}
                {availabilityMessage && (
                  <p className="availability-message">{availabilityMessage}</p>
                )}
              </div>
            )}
          </div>
        
          {/* Canvas or Preview */}
          <div className="canvas-container">
            {!showPreview ? (
              <SpirographCanvas
                seed={seed}
                setSeed={setSeed}
                onShapeChange={handleShapeChange}
                onPaletteChange={handlePaletteChange}
                onDrawingComplete={handleDrawingComplete}
              />
            ) : (
              <div className="preview-container">
                <div className="animation-preview">
                  <div className="rotating-image">
                    {image && image.canvas && (
                      <img 
                        src={image.canvas.toDataURL('image/png')} 
                        alt="Animated Spirograph"
                        className="preview-gif"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="canvas-actions">
            <button 
              className="action-button generate-button"
              onClick={handleGenerateNew}
              disabled={isMinting}
            >
              Generate New Design
            </button>
            
            {showPreview && (
              <>
                <button 
                  onClick={handleDownloadImage} 
                  className="action-button download-button"
                >
                  Download Image
                </button>
                
                <button 
                  onClick={handleMint}
                  className="action-button mint-button"
                  disabled={isMinting || !isSeedAvailableState}
                >
                  {isMinting ? 'Minting...' : 'Mint as NFT'}
                </button>
              </>
            )}
          </div>
          
          {/* Success/Error Messages */}
          {mintStatus === 'success' && (
            <div className="mint-success">
              <h3>Success! 🎉</h3>
              <p>Your Spyro NFT has been minted and sent to your wallet.</p>
              <div className="share-buttons">
                <button className="share-twitter">Share on X</button>
                <button className="share-copy">Copy Link</button>
              </div>
            </div>
          )}
          
          {mintStatus === 'error' && (
            <div className="mint-error">
              <h3>Error Minting</h3>
              <p>There was a problem creating your NFT. Please try again.</p>
              <button onClick={() => setMintStatus(null)} className="try-again-button">Try Again</button>
            </div>
          )}
        </div>
        
        <div className="info-side">
          {/* Token Gate Info */}
          <div className="token-gate-info">
            <h3>Token Gate</h3>
            <p>This is a token-gated experience. You need to own our special token to mint NFTs for free.</p>
            {!isWalletConnected && (
              <p>Connect your wallet to check if you have the token.</p>
            )}
            {isWalletConnected && !hasToken && (
              <div>
                <p>You don't have the required token yet.</p>
                <a href="https://opensea.io/collection/spyro-access-token" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="get-token-button">
                  Get Token
                </a>
              </div>
            )}
            {isWalletConnected && hasToken && (
              <p className="token-success">You have the token! Mint as many NFTs as you want.</p>
            )}
          </div>
          
          {/* Rarity Info */}
          <div className="rarity-info">
            <h3>Rarity Information</h3>
            <div className="rarity-table">
              <div className="rarity-row">
                <span className="rarity-type common">Common</span>
                <span className="rarity-percent">40%</span>
              </div>
              <div className="rarity-row">
                <span className="rarity-type uncommon">Uncommon</span>
                <span className="rarity-percent">30%</span>
              </div>
              <div className="rarity-row">
                <span className="rarity-type rare">Rare</span>
                <span className="rarity-percent">20%</span>
              </div>
              <div className="rarity-row">
                <span className="rarity-type super-rare">Super Rare</span>
                <span className="rarity-percent">8%</span>
              </div>
              <div className="rarity-row">
                <span className="rarity-type legendary">Legendary</span>
                <span className="rarity-percent">2%</span>
              </div>
            </div>
            <p className="rarity-tip">The rarer your Spyro, the higher the token rewards after 90 days!</p>
          </div>
          
          {/* Shapes & Features */}
          <div className="features-info">
            <h3>Shape Types</h3>
            <ul className="features-list">
              <li><strong>Rhodonea:</strong> Rose-like curves with symmetric petals</li>
              <li><strong>Epitrochoid:</strong> Curves traced by a point on a circle rolling around the outside of another circle</li>
              <li><strong>Hypotrochoid:</strong> Curves traced by a point on a circle rolling inside another circle</li>
              <li><strong>OrganicFlow:</strong> Dynamic patterns with natural, flowing variations</li>
              <li><strong>Lissajous:</strong> Complex patterns created by two perpendicular oscillations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;