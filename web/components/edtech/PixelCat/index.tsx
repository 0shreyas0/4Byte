"use client";

/**
 * Pixel-art cat that walks across the navbar — ported from the coinplex
 * sprite-sheet approach (CatsBlack16x16Tile.png).
 *
 * The sprite is a 16 × 16 px tile-sheet. Row 3 (y = -48px) is the "run-right"
 * row with 4 frames, each 16 px wide.
 *
 * Two CSS animations run together:
 *   1. `walk`  – steps through 4 sprite frames
 *   2. `move-across` – translates the cat from left → right across the track
 */
export default function PixelCat() {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        overflow: "hidden",
        height: "100%",
        cursor: "default",
      }}
    >
      {/* The running cat */}
      <div
        style={{
          position: "absolute",
          bottom: 2,
          left: "-50px",
          width: 16,
          height: 16,
          background: `url("/CatsBlack16x16Tile.png") 0 -48px no-repeat`,
          imageRendering: "pixelated",
          transform: "scale(8)",
          transformOrigin: "bottom left",
          animation: "pixel-cat-walk 0.5s steps(4) infinite, pixel-cat-move 8s linear infinite",
        }}
      />

      {/* Keyframe definitions injected via <style> */}
      <style>{`
        @keyframes pixel-cat-walk {
          from { background-position-x: 0; }
          to   { background-position-x: -64px; }   /* 4 frames × 16px */
        }
        @keyframes pixel-cat-move {
          0%   { left: -50px; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
