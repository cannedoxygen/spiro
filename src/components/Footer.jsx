import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>Spirograph NFT</h3>
          <p>Create, mint, and share beautiful mathematical patterns inspired by the classic Spirograph toy.</p>
          <div className="social-links">
            <a href="https://twitter.com/spironft" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://www.t.me/spironft" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 9a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v7.5a2.5 2.5 0 0 0 2.5 2.5H15a5 5 0 0 0 5-5V9z"></path><path d="M9 11.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path><path d="M14.5 11.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path><path d="M7 16.5c.333-.667 1.7-2 5-2s4.667 1.333 5 2"></path></svg>
            </a>
            <a href="https://github.com/cannedoxygen/spiro" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
          </div>
        </div>
        
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create NFT</Link></li>
            <li><Link to="/collection">My Collection</Link></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>
        
        <div className="footer-section legal">
          <h3>Legal</h3>
          <ul>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        
        <div className="footer-section newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for updates and new features.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} Spirograph NFT. All rights reserved.
        </div>
        <div className="disclaimer">
          Not affiliated with the original Spirograph™ brand. This is an artistic homage.
        </div>
      </div>
    </footer>
  );
};

export default Footer;