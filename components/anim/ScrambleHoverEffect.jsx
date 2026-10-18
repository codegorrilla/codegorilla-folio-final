"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import ProfilePic from "@/assets/profile-pic.png";

// ── Config ────────────────────────────────────────────────────────────────────
// symbols spell the author's name — personal touch on hover
const config = {
  symbols: ["S", "A", "N", "J", "I", "B"],
  blockSize: 28,
  detectionRadius: 45,
  clusterSize: 3,
  blockLifetime: 320,
  emptyRatio: 0.55,
  scrambleRatio: 0.15,
  scrambleInterval: 140,
};

const getRandomSymbol = () =>
  config.symbols[Math.floor(Math.random() * config.symbols.length)];

// ── Imperative grid logic ────────────────────────────────────────────────────
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
export const ScrambleHoverEffect = ({ className = "w-[600px] h-[550px]" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cleanup = null;
    let rafId = null;

    const setup = () => {
      if (cleanup) cleanup();
      if (el.offsetWidth > 0 && el.offsetHeight > 0) {
        cleanup = initGridOverlay(el);
      }
    };

    rafId = requestAnimationFrame(() => {
      setup();
    });

    const resizeObserver = new ResizeObserver(() => {
      setup();
    });
    resizeObserver.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-3xl overflow-hidden cursor-crosshair shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex items-center justify-center bg-[#15171b] ${className}`}
    >
      {/* 
        Inside Profile Image:
        Fills the 600x550px profile card edge-to-edge with object-cover,
        eliminating empty white space, with NO border.
      */}
      <Image
        src={ProfilePic}
        alt="Profile picture"
        fill
        sizes="600px"
        className="w-full h-full object-cover object-center block rounded-3xl select-none pointer-events-none"
        priority
      />
    </div>
  );
};
