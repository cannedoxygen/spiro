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
            and mint them as animated NFTs — completely free for token holders.
          </p>
          <div className="hero-buttons">
            <Link to="/create" className="btn-primary">Start Creating</Link>
            <a href="#how-it-works" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/api/placeholder/500/500" alt="Spirograph pattern" />
        </div>
      </section>
      
      {/* Features section */}
      <section className="features" id="features">
        <h2>Your Spirograph, Your NFT</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✏️</div>
            <h3>Create</h3>
            <p>Design beautiful geometric patterns with our interactive Spirograph generator.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🪄</div>
            <h3>Animate</h3>
            <p>Watch your pattern come to life with animations that show the creation process.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Mint</h3>
            <p>Turn your creation into an NFT stored permanently on the blockchain.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎁</div>
            <h3>Share</h3>
            <p>Show off your mathematical art on social media or send it to friends.</p>
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
              <h3>Connect Your Wallet</h3>
              <p>Link your Phantom wallet to verify you own the gate token.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Design Your Pattern</h3>
              <p>Use the interactive controls to create a unique Spirograph design.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Mint Your NFT</h3>
              <p>With one click, your design becomes an animated NFT in your wallet.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Share With Friends</h3>
              <p>Show off your creation on social media or send it directly to friends.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Token gate info */}
      <section className="token-gate">
        <div className="token-gate-content">
          <h2>Free Minting for Token Holders</h2>
          <p>
            Mint as many Spirograph NFTs as you want without paying any gas fees —
            just own our special access token in your wallet.
          </p>
          <div className="token-actions">
            <a href="/token" className="btn-primary">Learn About Our Token</a>
            <a href="/marketplace" className="btn-secondary">Get Token</a>
          </div>
        </div>
        <div className="token-image">
          <img src="/api/placeholder/300/300" alt="Access token" />
        </div>
      </section>
      
      {/* Gallery preview */}
      <section className="gallery-preview">
        <h2>Gallery of Creations</h2>
        <p>Check out what others have created with our Spirograph generator</p>
        <div className="preview-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="preview-item">
              <img src={`/api/placeholder/300/300?text=Example%20${i}`} alt={`Example Spirograph ${i}`} />
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
            <h3>What is a Spirograph?</h3>
            <p>
              Spirograph is a geometric drawing toy invented in the 1960s that creates
              intricate mathematical curves using interlocking gears and rings.
              Our digital version recreates this experience with modern technology.
            </p>
          </div>
          <div className="faq-item">
            <h3>How does the token gate work?</h3>
            <p>
              When you connect your wallet, we check if you own our access token.
              If you do, you can mint unlimited Spirograph NFTs for free - we cover all gas fees.
            </p>
          </div>
          <div className="faq-item">
            <h3>Can I trade my Spirograph NFTs?</h3>
            <p>
              Yes! Once minted, your Spirograph NFTs are fully yours to keep, sell,
              or trade on any NFT marketplace that supports the Solana blockchain.
            </p>
          </div>
          <div className="faq-item">
            <h3>What blockchain is this on?</h3>
            <p>
              Our Spirograph NFTs are minted on the Solana blockchain, chosen for its
              low fees, energy efficiency, and fast transaction speeds.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="cta">
        <h2>Ready to Create Your Masterpiece?</h2>
        <p>Join our community of mathematical artists and start creating today.</p>
        <Link to="/create" className="btn-large">Start Creating</Link>
      </section>
    </div>
  );
};

export default Home;