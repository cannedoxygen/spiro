import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Create Stunning Spirograph NFTs</h1>
          <p className="hero-tagline">
            Design beautiful mathematical patterns inspired by the classic Spirograph toy
            and mint them as animated NFTs by burning SPIRO tokens.
          </p>
          <div className="hero-buttons">
            <Link to="/create" className="btn-primary">Start Creating</Link>
            <a href="#tokenomics" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="preview-image-container">
            <img src="/images/hero_spyro.png" alt="Spirograph pattern" className="preview-image" />
          </div>
        </div>
      </section>
      
      {/* Tokenomics section */}
      <section className="tokenomics" id="tokenomics">
        <h2>SPIRO Tokenomics</h2>
        <div className="tokenomics-grid">
          <div className="tokenomics-card">
            <div className="tokenomics-icon">💰</div>
            <h3>1 Billion Supply</h3>
            <p>SPIRO has a fixed total supply of 1 billion tokens, with 10% locked for 90 days to reward NFT holders.</p>
          </div>
          <div className="tokenomics-card">
            <div className="tokenomics-icon">🔥</div>
            <h3>Deflationary Model</h3>
            <p>Each NFT mint burns 10,000 SPIRO tokens, permanently removing them from circulation.</p>
          </div>
          <div className="tokenomics-card">
            <div className="tokenomics-icon">🎨</div>
            <h3>10,000 NFT Collection</h3>
            <p>A limited collection of 10,000 unique mathematical artworks with varying rarities.</p>
          </div>
          <div className="tokenomics-card">
            <div className="tokenomics-icon">💎</div>
            <h3>2 NFT Limit Per Wallet</h3>
            <p>Each wallet can mint a maximum of 2 NFTs to ensure fair distribution.</p>
          </div>
        </div>

        <div className="token-reward-info">
          <h3>90-Day Token Reward Program</h3>
          <div className="reward-info-content">
            <div className="reward-info-text">
              <p>After 90 days from launch, 100 million SPIRO tokens (10% of total supply) will be distributed among all NFT holders.</p>
              <p>Rewards are based on NFT rarity:</p>
              <ul>
                <li><strong>Common (40%):</strong> Base reward</li>
                <li><strong>Uncommon (30%):</strong> 1.5× reward</li>
                <li><strong>Rare (20%):</strong> 2× reward</li>
                <li><strong>Super Rare (8%):</strong> 3× reward</li>
                <li><strong>Legendary (2%):</strong> 5× reward</li>
              </ul>
              <p>The more rare your NFT, the bigger your reward!</p>
            </div>
            <div className="reward-info-visual">
              <div className="token-distribution-chart">
                <div className="chart-segment circulating" style={{ height: '90%' }}>
                  <span>90% Circulating Supply</span>
                </div>
                <div className="chart-segment locked" style={{ height: '10%' }}>
                  <span>10% Locked for NFT Rewards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="how-it-works" id="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Get SPIRO Tokens</h3>
              <p>Acquire SPIRO tokens from supported exchanges or the token launch.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Connect Your Wallet</h3>
              <p>Connect MetaMask, Phantom, or Coinbase Wallet on Base network.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Mint Your NFT</h3>
              <p>Burn 10,000 SPIRO tokens to mint a unique Spirograph NFT (max 2 per wallet).</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Receive Rewards</h3>
              <p>After 90 days, receive SPIRO tokens based on your NFT's rarity.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery preview */}
      <section className="gallery-preview">
        <h2>Gallery of Creations</h2>
        <p>Each Spirograph NFT is a unique mathematical masterpiece with varying rarity</p>
        <div className="preview-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="preview-item">
              <div className="preview-image-container">
                <img 
                  src={`/images/example_spyro_${i}.png`} 
                  alt={`Example Spirograph ${i}`} 
                  className="preview-image"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="gallery-cta">
          <Link to="/create" className="btn-primary">Create Your Own</Link>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-items">
          <div className="faq-item">
            <h3>What is SPIRO?</h3>
            <p>
              SPIRO is a deflationary token that powers the Spirograph NFT ecosystem. It has a fixed supply of 1 billion 
              tokens, with 10% locked for rewards to NFT holders after 90 days.
            </p>
          </div>
          <div className="faq-item">
            <h3>How do I mint a Spirograph NFT?</h3>
            <p>
              You need to hold at least 10,000 SPIRO tokens and connect your wallet to our platform. When you mint, 
              10,000 SPIRO tokens will be burned. Each wallet can mint a maximum of 2 NFTs.
            </p>
          </div>
          <div className="faq-item">
            <h3>How are rewards distributed?</h3>
            <p>
              After 90 days from launch, 100 million SPIRO tokens will be distributed to all NFT holders based on the 
              rarity of their NFTs. Rarer NFTs receive proportionally larger rewards.
            </p>
          </div>
          <div className="faq-item">
            <h3>What blockchain is this on?</h3>
            <p>
              Spirograph NFTs and the SPIRO token are deployed on the Base network, offering low transaction fees and 
              high performance.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="cta">
        <h2>Mint Your Spirograph NFT</h2>
        <p>Burn 10,000 SPIRO tokens to create your unique mathematical artwork and earn token rewards.</p>
        <Link to="/create" className="btn-large">Start Creating</Link>
      </section>
    </div>
  );
};

export default Home;