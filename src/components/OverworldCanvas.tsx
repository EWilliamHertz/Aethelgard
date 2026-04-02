// src/components/OverworldCanvas.tsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

// --- GAME CONSTANTS ---
const TILE_SIZE = 32;
const COLS = 20;
const ROWS = 15;
const WIDTH = COLS * TILE_SIZE;
const HEIGHT = ROWS * TILE_SIZE;

// Map directions to row indexes in your seed-singer-sprites.png sheet
const DIR_MAP = { DOWN: 0, UP: 1, RIGHT: 2, LEFT: 2 }; 

// --- MAP DATA (0 = Walkable Grass, 1 = Obstacle Tree/Ruin) ---
const mapData = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,0,1],
  [1,0,0,1,0,1,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
  [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
  [1,0,1,0,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1],
  [1,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

interface PlayerPos {
  x: number;
  y: number;
}

interface Props {
  onMove: (newPos: PlayerPos) => void;
  onEncounter: () => void;
}

export default function OverworldCanvas({ onMove, onEncounter }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spriteRef = useRef<HTMLImageElement | null>(null);
  
  // Player State
  const [playerPos, setPlayerPos] = useState<PlayerPos>({ x: 2, y: 7 });
  const [direction, setDirection] = useState<'DOWN' | 'UP' | 'LEFT' | 'RIGHT'>('DOWN');
  const [frame, setFrame] = useState(0); 

  // --- 1. LOAD SPRITE SHEET ---
  useEffect(() => {
    const img = new Image();
    img.src = '/images/seed-singer-sprites.png'; // Ensure this file is saved!
    img.onload = () => { spriteRef.current = img; };
  }, []);

  // --- 2. DRAW LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !spriteRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Draw Map
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const tileType = mapData[r][c];
          if (tileType === 0) {
            ctx.fillStyle = '#064e3b'; // Walkable Grass
          } else {
            ctx.fillStyle = '#115e59'; // Obstacle
          }
          ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE - 1, TILE_SIZE - 1);
        }
      }

      // Draw Player Sprite
      const spriteSize = 32; 
      const row = DIR_MAP[direction];
      const col = frame;
      const drawX = playerPos.x * TILE_SIZE;
      const drawY = playerPos.y * TILE_SIZE;

      // If facing left, we need to flip the canvas horizontally to draw the sprite backwards
      if (direction === 'LEFT') {
        ctx.save();
        ctx.scale(-1, 1);
        // Because we flipped the canvas, the X coordinate becomes negative
        ctx.drawImage(
          spriteRef.current!,
          col * spriteSize, row * spriteSize, spriteSize, spriteSize,
          -drawX - TILE_SIZE, drawY, TILE_SIZE, TILE_SIZE
        );
        ctx.restore();
      } else {
        // Normal drawing for Down, Up, and Right
        ctx.drawImage(
          spriteRef.current!,
          col * spriteSize, row * spriteSize, spriteSize, spriteSize,
          drawX, drawY, TILE_SIZE, TILE_SIZE
        );
      }

      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [playerPos, direction, frame]);

  // --- 3. MOVEMENT & COLLISION ---
  const attemptMove = useCallback((dx: number, dy: number, dir: 'DOWN' | 'UP' | 'LEFT' | 'RIGHT') => {
    setDirection(dir);
    // Cycle through 4 animation frames when walking
    setFrame((f) => (f + 1) % 4); 

    setPlayerPos((prev) => {
      const nextX = prev.x + dx;
      const nextY = prev.y + dy;

      // Bound Check
      const isWithinBounds = nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS;
      if (!isWithinBounds) return prev;

      // Obstacle Check
      const nextTile = mapData[nextY][nextX];
      if (nextTile === 1) return prev;

      // 10% Encounter Chance Check
      if (nextTile === 0 && Math.random() < 0.10) {
        onEncounter(); 
      }

      const newPos = { x: nextX, y: nextY };
      onMove(newPos);
      return newPos;
    });
  }, [onMove, onEncounter]);

  // --- 4. KEYBOARD INPUT ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case 'w': case 'ArrowUp': attemptMove(0, -1, 'UP'); break;
        case 's': case 'ArrowDown': attemptMove(0, 1, 'DOWN'); break;
        case 'a': case 'ArrowLeft': attemptMove(-1, 0, 'LEFT'); break;
        case 'd': case 'ArrowRight': attemptMove(1, 0, 'RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [attemptMove]);

  return (
    <div className="border-4 border-emerald-900 shadow-[8px_8px_0_rgba(2,44,34,1)] inline-block bg-black p-1">
      <canvas 
        ref={canvasRef} 
        width={WIDTH} 
        height={HEIGHT}
        className="block" 
      />
    </div>
  );
}