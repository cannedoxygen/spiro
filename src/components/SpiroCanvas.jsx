// Improvement for src/components/SpiroCanvas.jsx
// This version creates distinct layers and preserves the black background

import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import '../styles/components.css';

const SpiroCanvas = ({ 
  seed,
  setSeed,
  onShapeChange,
  onPaletteChange,
  onDrawingComplete
}) => {
  const canvasRef = useRef(null);
  const p5Instance = useRef(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [progress, setProgress] = useState(0);

  // Initialize the p5 sketch
  useEffect(() => {
    // Define the sketch
    const sketch = (p) => {
      // 🌈 VAPORWAVE PALETTES with names
      const palettes = [
        {name: "Neon Mirage", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FDCB6E", "#6C5CE7"], rarity: "Common"},
        {name: "Digital Dream", colors: ["#FF00CC", "#3333FF", "#00FFF7", "#FFD6E8", "#BAFFC9"], rarity: "Uncommon"},
        {name: "Crystal Sunset", colors: ["#9B5DE5", "#F15BB5", "#FEE440", "#00BBF9", "#00F5D4"], rarity: "Rare"},
        {name: "Cyber Haze", colors: ["#F72585", "#B5179E", "#7209B7", "#3A0CA3", "#4361EE"], rarity: "Super Rare"},
        {name: "Pastel Vapor", colors: ["#FF6EC7", "#FFC8DD", "#A0C4FF", "#BDB2FF", "#FFADAD"], rarity: "Legendary"}
      ];

      // Shape rarity distribution
      const shapeRarity = {
        "Rhodonea": "Common", // 40%
        "Epitrochoid": "Uncommon", // 30%
        "Hypotrochoid": "Rare", // 20%
        "OrganicFlow": "Super Rare", // 8%
        "Lissajous": "Legendary" // 2%
      };

      // Multiple layer canvases - NEW!
      let mainCanvas; // Main visible canvas with black background
      let layerCanvases = []; // Array of layer graphics for each color
      let finalOutput; // Final combined output

      // Variables for drawing
      let shapeType = "";
      let params = {};
      let palette;
      let currentColor;
      let t = 0;
      let maxT;
      let prevX = null;
      let prevY = null;
      let globalAngle = 0;
      let currentColorIndex = 0;
      let rarityText = "";
      let currentSeed = seed || Math.floor(p.random(1, 10001));
      
      // Layer tracking
      let totalLayers = 5; // Match number of colors in palette
      let currentLayer = 0;
      let layerCompletionPoints = []; // Points at which to switch layers
      
      // Helper function to find greatest common divisor
      const findGCD = (a, b) => {
        a = Math.round(a);
        b = Math.round(b);
        return b === 0 ? a : findGCD(b, a % b);
      };

      // Calculate the maximum boundaries of the pattern to ensure it fits
      const calculatePatternBoundaries = () => {
        let maxX = 0;
        let maxY = 0;
        
        // Sample many points to find the maximum extent
        for (let step = 0; step < maxT; step += 0.1) {
          let x = 0;
          let y = 0;
          
          // Calculate position based on shape type
          switch(shapeType) {
            case "Hypotrochoid":
              x = (params.R - params.r1) * p.cos(step) + params.d * p.cos(((params.R - params.r1) / params.r1) * step);
              y = (params.R - params.r1) * p.sin(step) - params.d * p.sin(((params.R - params.r1) / params.r1) * step);
              break;
            case "Epitrochoid":
              x = (params.R + params.r1) * p.cos(step) - params.d * p.cos(((params.R + params.r1) / params.r1) * step);
              y = (params.R + params.r1) * p.sin(step) - params.d * p.sin(((params.R + params.r1) / params.r1) * step);
              break;
            case "Rhodonea":
              let rhodoneaRadius = 250 * p.cos(params.k * step);
              x = rhodoneaRadius * p.cos(step);
              y = rhodoneaRadius * p.sin(step);
              break;
            case "Lissajous":
              x = params.A * p.sin(params.a * step + params.delta);
              y = params.B * p.sin(params.b * step);
              break;
            case "OrganicFlow":
              let baseRadius = 150;
              let noiseTime = step * params.speed;
              
              let radius = baseRadius;
              for (let i = 0; i < params.waves; i++) {
                let noiseFactor = p.noise(
                  p.cos(step + i) * params.noiseScale, 
                  p.sin(step + i) * params.noiseScale, 
                  noiseTime
                );
                radius += p.sin(step * (i+1) * params.complexity) * params.amplitude * noiseFactor;
              }
              
              x = radius * p.cos(step);
              y = radius * p.sin(step);
              
              x += p.sin(step * 3.5) * 20 * p.noise(noiseTime * 2, 0);
              y += p.cos(step * 2.7) * 20 * p.noise(0, noiseTime * 2);
              break;
          }
          
          // Update max boundaries
          maxX = Math.max(maxX, Math.abs(x));
          maxY = Math.max(maxY, Math.abs(y));
        }
        
        return { maxX, maxY };
      };

      // Get the scale factor needed to fit the pattern
      const getScaleFactor = () => {
        const { maxX, maxY } = calculatePatternBoundaries();
        const maxExtent = Math.max(maxX, maxY);
        
        // Canvas size is 600x600, center is at 300,300
        // Leave a 50px margin on all sides
        const maxAllowedExtent = 250; // (600/2 - 50)
        
        // If pattern is too big, scale it down
        if (maxExtent > maxAllowedExtent) {
          return maxAllowedExtent / maxExtent;
        }
        
        // Otherwise, keep original scale
        return 1.0;
      };

      // Get the final image when completed
      const generateFinalOutput = () => {
        // Create two separate graphics:
        // 1. The background canvas (black)
        let backgroundCanvas = p.createGraphics(600, 600);
        backgroundCanvas.background(0); // BLACK BACKGROUND
        
        // 2. The transparent spirograph with all layers merged (but no background)
        let transparentSpiro = p.createGraphics(600, 600);
        transparentSpiro.clear(); // Completely transparent
        
        // Overlay all layers onto the transparent spirograph
        for (let i = 0; i < layerCanvases.length; i++) {
          transparentSpiro.image(layerCanvases[i], 0, 0);
        }
        
        // Return just the transparent spirograph - the black background stays in the canvas
        return transparentSpiro;
      };
      
      // Select shape type based on seed and rarity
      const selectShapeType = () => {
        // Use probability distribution based on rarity levels
        let shapeRoll = p.random(100);
        let shapeIndex;
        
        if (shapeRoll < 40) {
          shapeIndex = 0; // Rhodonea - Common 40%
        } else if (shapeRoll < 70) {
          shapeIndex = 1; // Epitrochoid - Uncommon 30%
        } else if (shapeRoll < 90) {
          shapeIndex = 2; // Hypotrochoid - Rare 20%
        } else if (shapeRoll < 98) {
          shapeIndex = 3; // OrganicFlow - Super Rare 8%
        } else {
          shapeIndex = 4; // Lissajous - Legendary 2%
        }
        
        params = {}; // Reset params
        
        switch(shapeIndex) {
          case 0: // Rhodonea (now Common)
            shapeType = "Rhodonea";
            params.k = p.int(p.random(4, 9));
            
            maxT = (params.k % 2 === 0) ? p.TWO_PI : p.PI;
            break;
            
          case 1: // Epitrochoid (remains Uncommon)
            shapeType = "Epitrochoid";
            params.R = p.random(200, 300);
            params.r1 = p.random(20, 60);
            params.d = p.random(80, 160);
            
            const gcd2 = findGCD(params.R, params.r1);
            maxT = p.TWO_PI * (params.r1 / gcd2);
            break;
            
          case 2: // Hypotrochoid (now Rare)
            shapeType = "Hypotrochoid";
            params.R = p.random(250, 400);
            params.r1 = p.random(20, 60);
            params.d = p.random(100, 180);
            
            const gcd = findGCD(params.R, params.r1);
            maxT = p.TWO_PI * (params.r1 / gcd);
            break;
            
          case 3: // OrganicFlow (now Super Rare)
            shapeType = "OrganicFlow";
            params.complexity = p.random(0.5, 2.5);
            params.speed = p.random(0.01, 0.05);
            params.waves = p.int(p.random(3, 7));
            params.amplitude = p.random(100, 250);
            params.noiseScale = p.random(0.005, 0.02);
            
            // These need longer time to develop
            maxT = p.TWO_PI * 20;
            break;
            
          case 4: // Lissajous (now Legendary)
            shapeType = "Lissajous";
            params.A = p.random(200, 350);
            params.B = p.random(200, 350);
            params.a = p.int(p.random(3, 7));
            params.b = p.int(p.random(3, 7));
            params.delta = p.random(0, p.PI);
            
            // Find cycle length
            const lcm = (params.a * params.b) / findGCD(params.a, params.b);
            maxT = p.TWO_PI * lcm;
            break;
        }
        
        // Ensure we have enough time for a complete pattern
        maxT = p.max(maxT, p.TWO_PI * 10);
        
        // NEW: Set up layer transitions - divide maxT into segments for each layer
        layerCompletionPoints = [];
        for (let i = 1; i < totalLayers; i++) {
          layerCompletionPoints.push((i / totalLayers) * maxT);
        }
        layerCompletionPoints.push(maxT); // Final completion point
        
        rarityText = shapeRarity[shapeType];
        
        // Update parent component
        onShapeChange && onShapeChange({
          type: shapeType,
          rarity: rarityText,
          params: { ...params }
        });
      };

      // Reset sketch with new parameters
      const resetSketch = () => {
        // Clear all canvases
        p.background(0);
        mainCanvas.background(0);
        
        // Reset layer canvases
        layerCanvases = [];
        for (let i = 0; i < totalLayers; i++) {
          let layerCanvas = p.createGraphics(600, 600);
          layerCanvas.clear(); // Start with transparent background for each layer
          layerCanvases.push(layerCanvas);
        }
        
        p.randomSeed(currentSeed);
        
        // Pick a random palette with weighted probabilities
        let paletteRoll = p.random(100);
        if (paletteRoll < 40) {
          palette = palettes[0]; // Common - 40%
        } else if (paletteRoll < 70) {
          palette = palettes[1]; // Uncommon - 30%
        } else if (paletteRoll < 90) {
          palette = palettes[2]; // Rare - 20%
        } else if (paletteRoll < 98) {
          palette = palettes[3]; // Super Rare - 8%
        } else {
          palette = palettes[4]; // Legendary - 2%
        }
        
        totalLayers = palette.colors.length; // Match layers to palette colors
        
        p.strokeWeight(1); // Set to 1 as requested
        p.noFill();
        
        // Reset drawing variables
        t = 0;
        prevX = null;
        prevY = null;
        globalAngle = 0;
        currentColorIndex = 0;
        currentLayer = 0;
        
        // Pick a shape type
        selectShapeType();
        
        // Update parent component
        onPaletteChange && onPaletteChange({
          name: palette.name,
          rarity: palette.rarity,
          colors: [...palette.colors]
        });
        
        console.log(`Spirograph #${currentSeed} — ${shapeType} (${rarityText})`);
        console.log("Params:", params);
        console.log("Palette:", palette.name);
        
        // Start drawing loop if it was stopped
        if (!p.isLooping()) {
          p.loop();
        }
        
        setIsDrawing(true);
        setProgress(0);
      };

      // p5.js setup function
      p.setup = function() {
        // Create main canvas with black background
        const canvas = p.createCanvas(600, 600);
        canvas.style('display', 'block');
        canvas.style('margin', '0 auto');
        canvas.style('background-color', 'black'); // Ensure canvas always shows black
        
        // Initialize main drawing canvas with black background
        mainCanvas = p.createGraphics(600, 600);
        mainCanvas.background(0);
        
        // Initialize layer canvases - one for each color
        for (let i = 0; i < totalLayers; i++) {
          let layerCanvas = p.createGraphics(600, 600);
          layerCanvas.clear(); // Start with transparent background
          layerCanvases.push(layerCanvas);
        }
        
        p.frameRate(60);
        p.strokeJoin(p.ROUND);
        p.strokeCap(p.ROUND);
        
        // Apply same settings to all layer canvases
        for (let canvas of layerCanvases) {
          canvas.strokeJoin(p.ROUND);
          canvas.strokeCap(p.ROUND);
        }
        
        // Initialize with the provided seed or generate a random one
        currentSeed = seed || Math.floor(p.random(1, 10001));
        if (!seed) {
          setSeed && setSeed(currentSeed);
        }
        
        // Reset and initialize the sketch
        resetSketch();
      };

      // p5.js draw function
      p.draw = function() {
        // Clear main canvas once at the beginning
        if (p.frameCount === 1) {
          p.background(0);
        }
        
        // Display in-progress work
        p.image(mainCanvas, 0, 0);
        
        // Get the appropriate scale factor to fit pattern in canvas
        const scaleFactor = getScaleFactor();
        
        // Draw on the main canvas
        mainCanvas.push();
        mainCanvas.translate(mainCanvas.width / 2, mainCanvas.height / 2);
        
        // Add rotation that completes during drawing
        let fullRotationAngle = (t / maxT) * p.TWO_PI;
        mainCanvas.rotate(fullRotationAngle);
        
        // Current layer canvas (for separate color layers)
        let currentLayerCanvas = layerCanvases[currentLayer];
        currentLayerCanvas.push();
        currentLayerCanvas.translate(currentLayerCanvas.width / 2, currentLayerCanvas.height / 2);
        currentLayerCanvas.rotate(fullRotationAngle);
        
        // Set color for current layer
        currentColor = palette.colors[currentLayer];
        mainCanvas.stroke(currentColor);
        currentLayerCanvas.stroke(currentColor);
        mainCanvas.strokeWeight(1);
        currentLayerCanvas.strokeWeight(1);

        let x = 0;
        let y = 0;

        // Calculate the current position based on shape type
        switch(shapeType) {
          case "Hypotrochoid":
            x = (params.R - params.r1) * p.cos(t) + params.d * p.cos(((params.R - params.r1) / params.r1) * t);
            y = (params.R - params.r1) * p.sin(t) - params.d * p.sin(((params.R - params.r1) / params.r1) * t);
            break;
          case "Epitrochoid":
            x = (params.R + params.r1) * p.cos(t) - params.d * p.cos(((params.R + params.r1) / params.r1) * t);
            y = (params.R + params.r1) * p.sin(t) - params.d * p.sin(((params.R + params.r1) / params.r1) * t);
            break;
          case "Rhodonea":
            let rhodoneaRadius = 250 * p.cos(params.k * t);
            x = rhodoneaRadius * p.cos(t);
            y = rhodoneaRadius * p.sin(t);
            break;
          case "Lissajous":
            x = params.A * p.sin(params.a * t + params.delta);
            y = params.B * p.sin(params.b * t);
            break;
          case "OrganicFlow":
            // Create organic, flowing patterns
            let baseRadius = 150;
            let noiseTime = t * params.speed;
            
            // Create multiple wave layers with perlin noise
            let radius = baseRadius;
            for (let i = 0; i < params.waves; i++) {
              let noiseFactor = p.noise(
                p.cos(t + i) * params.noiseScale, 
                p.sin(t + i) * params.noiseScale, 
                noiseTime
              );
              radius += p.sin(t * (i+1) * params.complexity) * params.amplitude * noiseFactor;
            }
            
            // Convert to x,y coordinates
            x = radius * p.cos(t);
            y = radius * p.sin(t);
            
            // Add some variation
            x += p.sin(t * 3.5) * 20 * p.noise(noiseTime * 2, 0);
            y += p.cos(t * 2.7) * 20 * p.noise(0, noiseTime * 2);
            break;
        }

        // Apply dynamic scaling to ensure pattern fits
        x *= scaleFactor;
        y *= scaleFactor;

        // Draw line segment on both canvases
        if (prevX !== null) {
          mainCanvas.line(prevX, prevY, x, y);
          currentLayerCanvas.line(prevX, prevY, x, y);
        }
        
        // Store current position
        prevX = x;
        prevY = y;

        // Draw additional segments in this same frame
        const stepsPerFrame = 2;
        for (let i = 1; i < stepsPerFrame; i++) {
          // Increment time with smaller steps
          t += 0.015;
          
          // Check if we've reached a layer transition point
          if (currentLayer < layerCompletionPoints.length-1 && t >= layerCompletionPoints[currentLayer]) {
            // Time to move to next layer
            currentLayer++;
            // Make sure we don't go beyond the array bounds
            if (currentLayer < layerCanvases.length) {
              currentLayerCanvas = layerCanvases[currentLayer];
              currentLayerCanvas.push();
              currentLayerCanvas.translate(currentLayerCanvas.width / 2, currentLayerCanvas.height / 2);
              // Apply rotation to the new layer
              let fullRotationAngle = (t / maxT) * p.TWO_PI;
              currentLayerCanvas.rotate(fullRotationAngle);
              currentColor = palette.colors[Math.min(currentLayer, palette.colors.length - 1)];
              mainCanvas.stroke(currentColor);
              currentLayerCanvas.stroke(currentColor);
            }
          }
          
          // Calculate new position for this sub-step
          let nextX = 0;
          let nextY = 0;
          
          // Re-calculate based on shape type with updated t
          switch(shapeType) {
            case "Hypotrochoid":
              nextX = (params.R - params.r1) * p.cos(t) + params.d * p.cos(((params.R - params.r1) / params.r1) * t);
              nextY = (params.R - params.r1) * p.sin(t) - params.d * p.sin(((params.R - params.r1) / params.r1) * t);
              break;
            case "Epitrochoid":
              nextX = (params.R + params.r1) * p.cos(t) - params.d * p.cos(((params.R + params.r1) / params.r1) * t);
              nextY = (params.R + params.r1) * p.sin(t) - params.d * p.sin(((params.R + params.r1) / params.r1) * t);
              break;
            case "Rhodonea":
              let rhodoneaRadius = 250 * p.cos(params.k * t);
              nextX = rhodoneaRadius * p.cos(t);
              nextY = rhodoneaRadius * p.sin(t);
              break;
            case "Lissajous":
              nextX = params.A * p.sin(params.a * t + params.delta);
              nextY = params.B * p.sin(params.b * t);
              break;
            case "OrganicFlow":
              let baseRadius = 150;
              let noiseTime = t * params.speed;
              
              let radius = baseRadius;
              for (let i = 0; i < params.waves; i++) {
                let noiseFactor = p.noise(
                  p.cos(t + i) * params.noiseScale, 
                  p.sin(t + i) * params.noiseScale, 
                  noiseTime
                );
                radius += p.sin(t * (i+1) * params.complexity) * params.amplitude * noiseFactor;
              }
              
              nextX = radius * p.cos(t);
              nextY = radius * p.sin(t);
              
              nextX += p.sin(t * 3.5) * 20 * p.noise(noiseTime * 2, 0);
              nextY += p.cos(t * 2.7) * 20 * p.noise(0, noiseTime * 2);
              break;
          }
          
          // Apply dynamic scaling to ensure pattern fits
          nextX *= scaleFactor;
          nextY *= scaleFactor;
          
          // Draw the line on both canvases
          mainCanvas.line(prevX, prevY, nextX, nextY);
          currentLayerCanvas.line(prevX, prevY, nextX, nextY);
          
          // Update previous position for next segment
          prevX = nextX;
          prevY = nextY;
        }
        
        // Increment time
        t += 0.015;
        
        // Update global rotation
        globalAngle = (t / maxT) * p.TWO_PI;
        
        // Update progress
        const currentProgress = Math.min(100, Math.round((t / maxT) * 100));
        if (currentProgress !== progress) {
          setProgress(currentProgress);
        }
        
        // End current push transforms
        mainCanvas.pop();
        currentLayerCanvas.pop();

        // Check if drawing is complete
        if (t > maxT) {
          p.noLoop(); // Stop drawing when complete
          setIsDrawing(false);
          
          // Make sure to end all open transforms
          mainCanvas.pop();
          // Safely pop any open layer transforms
          for (let i = 0; i < layerCanvases.length; i++) {
            try {
              layerCanvases[i].pop();
            } catch (e) {
              // Ignore errors if there's no matching push
              console.log("Note: Layer", i, "didn't need popping");
            }
          }
          
          // Generate final output with black background and all layers
          finalOutput = generateFinalOutput();
          
          // Notify parent that drawing is complete
          onDrawingComplete && onDrawingComplete(finalOutput);
        }
      };
      
      // Generate a new random seed
      p.generateNewSeed = () => {
        currentSeed = Math.floor(p.random(1, 10001));
        setSeed && setSeed(currentSeed);
        resetSketch();
      };
      
      // Change to a specific seed
      p.setSeed = (newSeed) => {
        currentSeed = newSeed;
        resetSketch();
      };
    };

    // Create a new p5 instance
    p5Instance.current = new p5(sketch, canvasRef.current);
    
    // Cleanup function
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
      }
    };
  }, [seed]); // Re-initialize when seed changes

  return (
    <div className="spiro-canvas-container">
      <div ref={canvasRef} className="canvas-wrapper"></div>
      {isDrawing && (
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{progress}%</span>
        </div>
      )}
      {!isDrawing && (
        <div className="canvas-complete">
          <span>Drawing complete!</span>
        </div>
      )}
    </div>
  );
};

export default SpiroCanvas;