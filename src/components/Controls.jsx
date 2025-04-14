import React, { useState } from 'react';
import '../styles/components.css';

const Controls = ({ 
  fixedRadius, 
  setFixedRadius, 
  movingRadius, 
  setMovingRadius, 
  offset, 
  setOffset, 
  strokeWeight, 
  setStrokeWeight, 
  strokeColor,
  setStrokeColor,
  onReset,
  onMint,
  isMinting
}) => {
  // Available color options
  const colorOptions = [
    { value: '#e3262e', name: 'Red' },
    { value: '#086da3', name: 'Blue' },
    { value: '#f7ce2a', name: 'Yellow' },
    { value: '#1e1e1e', name: 'Black' },
    { value: '#3cb43c', name: 'Green' },
    { value: '#9b30ff', name: 'Purple' },
  ];

  // Get parameter type based on movingRadius value
  const getPatternType = () => {
    return movingRadius < 0 ? "Epitrochoid" : "Hypotrochoid";
  };

  return (
    <div className="controls-container">
      <h3>Shape Controls</h3>
      
      <div className="control-row">
        <label htmlFor="fixed-radius">Fixed Circle:</label>
        <input 
          type="range" 
          id="fixed-radius" 
          min="50" 
          max="200" 
          value={fixedRadius} 
          onChange={(e) => setFixedRadius(parseInt(e.target.value))}
        />
        <span className="value-display">{fixedRadius}</span>
      </div>
      
      <div className="control-row">
        <label htmlFor="moving-radius">Moving Circle:</label>
        <input 
          type="range" 
          id="moving-radius" 
          min="10" 
          max="100" 
          value={movingRadius} 
          onChange={(e) => setMovingRadius(parseInt(e.target.value))}
        />
        <span className="value-display">{movingRadius}</span>
      </div>
      
      <div className="control-row">
        <label htmlFor="offset">Pen Offset:</label>
        <input 
          type="range" 
          id="offset" 
          min="0" 
          max="100" 
          value={offset} 
          onChange={(e) => setOffset(parseInt(e.target.value))}
        />
        <span className="value-display">{offset}</span>
      </div>
      
      <h3>Appearance</h3>
      
      <div className="control-row">
        <label htmlFor="stroke-weight">Line Weight:</label>
        <input 
          type="range" 
          id="stroke-weight" 
          min="1" 
          max="5" 
          value={strokeWeight} 
          onChange={(e) => setStrokeWeight(parseInt(e.target.value))}
        />
        <span className="value-display">{strokeWeight}</span>
      </div>
      
      <div className="control-row">
        <label>Pen Color:</label>
        <div className="color-buttons">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              className={`color-btn ${strokeColor === color.value ? 'active' : ''}`}
              style={{ backgroundColor: color.value }}
              onClick={() => setStrokeColor(color.value)}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>
      
      <div className="info-panel">
        <p>
          <strong>Pattern Info:</strong> {getPatternType()} with R={fixedRadius}, r={movingRadius}, d={offset}
        </p>
      </div>
      
      <div className="button-row">
        <button className="btn-reset" onClick={onReset}>
          New Drawing
        </button>
        <button 
          className="btn-mint" 
          onClick={onMint} 
          disabled={isMinting}
        >
          {isMinting ? 'Minting...' : 'Mint as NFT'}
        </button>
      </div>
    </div>
  );
};

export default Controls;