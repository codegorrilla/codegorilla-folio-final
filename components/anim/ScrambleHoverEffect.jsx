"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import ProfilePic from "@/assets/profile-pic.png";

// ── Config ────────────────────────────────────────────────────────────────────
// symbols spell the author's name — personal touch on hover
const config = {
  symbols: ["S", "A", "N", "J", "I", "B"],
  blockSize: 28,
  detectionRadius: 40,   // ↓ was 55 — smaller trigger footprint
  clusterSize: 2,        // ↓ was 5 — fewer neighbour blocks activate per event
  blockLifetime: 320,
  emptyRatio: 0.55,      // ↑ was 0.30 — more blank cells, less text density
  scrambleRatio: 0.15,   // ↓ was 0.28 — fewer cells cycle through symbols
  scrambleInterval: 140,
};

const getRandomSymbol = () =>
  config.symbols[Math.floor(Math.random() * config.symbols.length)];

// ── Imperative grid logic (ported 1-to-1 from reference JS) ──────────────────
function initGridOverlay(element) {
  const gridOverlay = document.createElement("div");
  gridOverlay.style.cssText = `
    position: absolute; inset: 0;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
    border-radius: inherit;
  `;

  const width = element.offsetWidth;
  const height = element.offsetHeight;
  const cols = Math.ceil(width / config.blockSize);
  const rows = Math.ceil(height / config.blockSize);

  const blocks = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.className = "scr-block";

      const isEmpty = Math.random() < config.emptyRatio;
      block.textContent = isEmpty ? "" : getRandomSymbol();

      block.style.cssText = `
        position: absolute;
        width: ${config.blockSize}px;
        height: ${config.blockSize}px;
        left: ${col * config.blockSize}px;
        top: ${row * config.blockSize}px;
      `;

      gridOverlay.appendChild(block);

      blocks.push({
        element: block,
        x: col * config.blockSize + config.blockSize / 2,
        y: row * config.blockSize + config.blockSize / 2,
        gridX: col,
        gridY: row,
        highlightEndTime: 0,
        isEmpty,
        shouldScramble: !isEmpty && Math.random() < config.scrambleRatio,
        scrambleInterval: null,
      });
    }
  }

  element.appendChild(gridOverlay);

  // ── Mouse handler ──────────────────────────────────────────────────────────
  function handleMouseMove(e) {
    const rect = element.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closestBlock = null;
    let closestDistance = Infinity;

    for (const block of blocks) {
      const dx = mouseX - block.x;
      const dy = mouseY - block.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestBlock = block;
      }
    }

    if (!closestBlock || closestDistance > config.detectionRadius) return;

    const currentTime = Date.now();
    closestBlock.element.classList.add("scr-active");
    closestBlock.highlightEndTime = currentTime + config.blockLifetime;

    if (closestBlock.shouldScramble && !closestBlock.scrambleInterval) {
      closestBlock.scrambleInterval = setInterval(() => {
        closestBlock.element.textContent = getRandomSymbol();
      }, config.scrambleInterval);
    }

    const clusterCount = Math.floor(Math.random() * config.clusterSize) + 1;
    let currentBlock = closestBlock;
    const activeBlocks = [closestBlock];

    for (let i = 0; i < clusterCount; i++) {
      const neighbors = blocks.filter((neighbor) => {
        if (activeBlocks.includes(neighbor)) return false;
        const dx = Math.abs(neighbor.gridX - currentBlock.gridX);
        const dy = Math.abs(neighbor.gridY - currentBlock.gridY);
        return dx <= 1 && dy <= 1;
      });

      if (neighbors.length === 0) break;

      const randomNeighbor =
        neighbors[Math.floor(Math.random() * neighbors.length)];

      randomNeighbor.element.classList.add("scr-active");
      randomNeighbor.highlightEndTime =
        currentTime + config.blockLifetime + i * 10;

      if (randomNeighbor.shouldScramble && !randomNeighbor.scrambleInterval) {
        randomNeighbor.scrambleInterval = setInterval(() => {
          randomNeighbor.element.textContent = getRandomSymbol();
        }, config.scrambleInterval);
      }

      activeBlocks.push(randomNeighbor);
      currentBlock = randomNeighbor;
    }
  }

  element.addEventListener("mousemove", handleMouseMove);

  // ── rAF highlight expiry loop ──────────────────────────────────────────────
  let rafId;
  function updateHighlights() {
    const currentTime = Date.now();
    blocks.forEach((block) => {
      if (block.highlightEndTime > 0 && currentTime > block.highlightEndTime) {
        block.element.classList.remove("scr-active");
        block.highlightEndTime = 0;

        if (block.scrambleInterval) {
          clearInterval(block.scrambleInterval);
          block.scrambleInterval = null;
          if (!block.isEmpty) {
            block.element.textContent = getRandomSymbol();
          }
        }
      }
    });
    rafId = requestAnimationFrame(updateHighlights);
  }
  rafId = requestAnimationFrame(updateHighlights);

  // Return cleanup fn
  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    cancelAnimationFrame(rafId);
    blocks.forEach((b) => {
      if (b.scrambleInterval) clearInterval(b.scrambleInterval);
    });
    gridOverlay.remove();
  };
}

// ── React component ───────────────────────────────────────────────────────────
export const ScrambleHoverEffect = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wait one frame so the image has rendered and offsetWidth/Height are set
    const id = requestAnimationFrame(() => {
      const cleanup = initGridOverlay(el);
      // Store cleanup on the ref so the return below can call it
      el._scrCleanup = cleanup;
    });

    return () => {
      cancelAnimationFrame(id);
      if (containerRef.current?._scrCleanup) {
        containerRef.current._scrCleanup();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden cursor-crosshair"
    >
      <Image
        src={ProfilePic}
        alt="Profile picture"
        width={420}
        height={560}
        className="w-full h-auto block rounded-2xl"
      />
    </div>
  );
};
