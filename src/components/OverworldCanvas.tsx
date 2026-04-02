// src/components/OverworldCanvas.tsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// --- GAME CONSTANTS (Solarpunk Themed) ---
const TILE_SIZE = 32; // Each grid square is 32x32 real pixels
const COLS = 20;
const ROWS = 15;
// The visible canvas dimensions
const WIDTH = COLS * TILE_SIZE;
const HEIGHT = ROWS * TILE_SIZE;

// --- MAP DATA (0 = Walkable Grass, 1 = Obstacle Tree/Ruin) ---
// Representing the 'Overgrown_Outpost' starting zone
const mapData = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,1],
  [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
  [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1], // Center obstruction
  [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
  [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
  [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface PlayerPos {
  x: number; // Grid coordinates, not pixel coordinates
  y: number;
}

interface Props {
  onMove: (newPos: PlayerPos) => void; // Function to call when player moves (for socket sync)
}

export default function OverworldCanvas({ onMove }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Starting position in the middle-left (grid coords)
  const [playerPos, setPlayerPos] = useState<PlayerPos>({ x: 2, y: 7 });

  // --- 1. THE DRAWING LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      // Clear the canvas
      ctx.fillStyle = '#000'; // Black background (The Void outside the Bloom)
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw the Map Tiles
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tileType = mapData[r][c];
          if (tileType === 0) {
            // Walkable: Deep Jungle Green
            ctx.fillStyle = '#064e3b'; 
          } else {
            // Obstacle (Tree/Ruin): Saturated Teal (like ancient glowing flora)
            ctx.fillStyle = '#115e59'; 
          }
          // Draw the square, leaving a 1px 'grid gap' for that chunky retro feel
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
        }
      }

      // Draw the Player (Seed-Singer)
      // Represented by bright Bioluminescent Cyan
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10; // Give the player a 'glow'
      ctx.fillRect(
        playerPos.x * TILE_SIZE + 4, 
        playerPos.y * TILE_SIZE + 4, 
        TILE_SIZE - 8, 
        TILE_SIZE - 8
      );
      // Reset shadow blur so it doesn't apply to tiles
      ctx.shadowBlur = 0;

      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw(); // Start the loop

    return () => {
      window.cancelAnimationFrame(animationFrameId); // Clean up loop on unmount
    };
  }, [playerPos]); // Re-draw if player moves


  // --- 2. MOVEMENT & COLLISION LOGIC ---
  const attemptMove = useCallback((dx: number, dy: number) => {
    setPlayerPos((prev) => {
      const nextX = prev.x + dx;
      const nextY = prev.y + dy;

      // Check Boundary Collisions (Is the next move within the grid?)
      const isWithinBounds = nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS;
      if (!isWithinBounds) return prev; // Stay put

      // Check Tile Collisions (Is the next tile walkable?)
      const nextTile = mapData[nextY][nextX];
      if (nextTile === 1) return prev; // It's an obstacle, stay put

      // Move is valid!
      const newPos = { x: nextX, y: nextY };
      
      // Sync this move with the parent component (and thus the PartyKit socket)
      onMove(newPos);
      
      return newPos;
    });
  }, [onMove]);


  // --- 3. INPUT HANDLING ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling behavior for these keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp': case 'w': attemptMove(0, -1); break;
        case 'ArrowDown': case 's': attemptMove(0, 1); break;
        case 'ArrowLeft': case 'a': attemptMove(-1, 0); break;
        case 'ArrowRight': case 'd': attemptMove(1, 0); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown); // Clean up listener
    };
  }, [attemptMove]); // Re-bind listener if movement logic changes


  return (
    <div className="border-4 border-emerald-900 shadow-[8px_8px_0_rgba(2,44,34,1)] inline-block bg-black p-1">
      <canvas 
        ref={canvasRef} 
        width={WIDTH} 
        height={HEIGHT}
        className="block" // Removes weird inline spacing
      />
    </div>
  );
}