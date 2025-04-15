import React, { useState } from 'react';
import '../styles/components.css';

const NFTCard = ({ 
  id, 
  image, 
  animationFrames, 
  parameters, 
  mintDate, 
  onShare,
  onSend
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showSendOptions, setShowSendOptions] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Format parameters for display
  const formatParameters = () => {
    if (!parameters) return '';
    return `Shape=${parameters.shape || ''}, R=${parameters.fixedRadius || ''}, r=${parameters.movingRadius || ''}, d=${parameters.offset || ''}`;
  };
  
  // Handle animation playback
  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playAnimation();
    }
  };
  
  // Play the animation
  const playAnimation = () => {
    if (!animationFrames || animationFrames.length === 0) return;
    
    let frame = 0;
    const interval = setInterval(() => {
      if (frame >= animationFrames.length - 1 || !isPlaying) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentFrame(0);
        return;
      }
      
      frame++;
      setCurrentFrame(frame);
    }, 50); // ~20fps
    
    return () => clearInterval(interval);
  };
  
  // Toggle share options
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
    if (showSendOptions) setShowSendOptions(false);
  };
  
  // Toggle send options
  const toggleSendOptions = () => {
    setShowSendOptions(!showSendOptions);
    if (showShareOptions) setShowShareOptions(false);
  };
  
  // Share on Twitter/X
  const shareOnTwitter = () => {
    const text = `Check out my Spirograph NFT #${id} created with mathematical parameters: ${formatParameters()}`;
    const url = `https://spirograph.nft/view/${id}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    setShowShareOptions(false);
  };
  
  // Copy link to clipboard
  const copyLink = () => {
    const url = `https://spirograph.nft/view/${id}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
        setShowShareOptions(false);
      })
      .catch(err => {
        console.error('Failed to copy link:', err);
      });
  };
  
  // Send NFT to another wallet
  const sendToWallet = () => {
    if (!recipientAddress) {
      alert('Please enter a recipient address');
      return;
    }
    
    onSend(id, recipientAddress);
    setShowSendOptions(false);
    setRecipientAddress('');
  };
  
  return (
    <div className="nft-card">
      <div className="nft-image-container" style={{ backgroundColor: 'black' }}>
        {animationFrames && animationFrames.length > 0 ? (
          <img 
            src={isPlaying ? animationFrames[currentFrame] : image} 
            alt={`Spirograph NFT #${id}`}
            className="nft-image"
          />
        ) : (
          <div className="preview-image-container">
            <img 
              src={image} 
              alt={`Spirograph NFT #${id}`}
              className="preview-image"
            />
          </div>
        )}
        
        {animationFrames && animationFrames.length > 0 && (
          <button 
            className="play-button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause animation" : "Play animation"}
          >
            {isPlaying ? "■" : "▶"}
          </button>
        )}
      </div>
      
      <div className="nft-info">
        <h3 className="nft-title">Spirograph #{id}</h3>
        <p className="nft-parameters">{formatParameters()}</p>
        <p className="nft-date">Created on {formatDate(mintDate)}</p>
        
        <div className="nft-actions">
          <button 
            className="action-button share-button"
            onClick={toggleShareOptions}
          >
            Share
          </button>
          <button 
            className="action-button send-button"
            onClick={toggleSendOptions}
          >
            Send
          </button>
        </div>
        
        {showShareOptions && (
          <div className="share-options">
            <button onClick={shareOnTwitter}>Share on X</button>
            <button onClick={copyLink}>Copy Link</button>
            <button onClick={toggleShareOptions}>Cancel</button>
          </div>
        )}
        
        {showSendOptions && (
          <div className="send-options">
            <input
              type="text"
              placeholder="Recipient wallet address"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="recipient-input"
            />
            <div className="send-buttons">
              <button onClick={sendToWallet}>Send</button>
              <button onClick={toggleSendOptions}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;