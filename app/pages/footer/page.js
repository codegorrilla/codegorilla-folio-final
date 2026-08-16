"use client";
import React, { useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── SVG path data ────────────────────────────────────────────────────────────
const logoPaths = {
  bent: {
    C: "M1738.44 191.574L1732.03 168.107L1718.49 171.001L1722.23 195.038L1652.31 209.984C1648.6 185.397 1646.32 159.887 1645.47 133.452C1644.58 106.869 1644.63 86.4324 1645.59 72.1428L1646.83 50.7559L1752.05 28.2656C1754.81 33.2453 1758.47 40.202 1763.01 49.1357C1767.55 58.0693 1775.14 75.4814 1785.78 101.372C1796.39 127.114 1805.18 151.931 1812.14 175.822L1738.44 191.574ZM1710.05 115.237L1715.68 150.246L1726.11 148.016L1717.16 113.718L1710.05 115.237Z",
    O: "M1527.92 69.0557L1605.27 58.3701L1618.76 155.961L1641.69 152.793L1649.67 210.583L1549.38 224.437L1527.92 69.0557Z",
    D: "M1426.7 79.5168L1504.38 71.5923L1514.38 169.602L1537.42 167.252L1543.34 225.29L1442.62 235.564L1426.7 79.5168Z",
    E: "M1358.36 242.16L1346.42 85.7577L1424.29 79.8181L1436.22 236.221L1358.36 242.16Z",
    DOT: "M1265.32 201.042L1267.59 246.84L1189.6 250.711L1181.83 94.0466L1264.13 89.962C1291.18 88.6192 1311.28 92.0916 1324.42 100.379C1337.55 108.516 1344.65 123.466 1345.73 145.232C1346.55 161.707 1341.79 174.14 1331.45 182.533C1341.32 198.255 1349.21 218.243 1355.11 242.497L1280.52 246.199C1278.55 230.993 1275.77 217.646 1272.17 206.157L1270.31 200.795L1265.32 201.042ZM1264.41 182.678L1270.98 182.352C1272.8 182.262 1274.28 181.582 1275.43 180.313C1276.58 179.044 1277.1 177.427 1277.01 175.462L1276.33 161.858C1276.23 159.893 1275.55 158.412 1274.29 157.414C1273.02 156.265 1271.48 155.735 1269.67 155.825L1263.09 156.152L1264.41 182.678Z",
    G: "M1097.89 206.747L1098.74 252.593L1020.66 254.034L1017.77 97.204L1100.15 95.6831C1127.24 95.1832 1147.22 99.2794 1160.09 107.972C1172.96 116.513 1179.6 131.678 1180 153.466C1180.31 169.959 1175.16 182.238 1164.56 190.304C1173.94 206.327 1181.2 226.551 1186.34 250.976L1111.67 252.354C1110.18 237.094 1107.81 223.667 1104.57 212.072L1102.88 206.655L1097.89 206.747ZM1097.55 188.363L1104.13 188.241C1105.95 188.208 1107.45 187.575 1108.64 186.342C1109.83 185.109 1110.4 183.509 1110.37 181.542L1110.11 167.925C1110.08 165.958 1109.44 164.456 1108.21 163.419C1106.98 162.231 1105.46 161.653 1103.64 161.687L1097.06 161.808L1097.55 188.363Z",
    O2: "M922.214 94.098L941.054 94.2872C968.293 94.5608 988.052 101.191 1000.33 114.179C1012.61 127.166 1018.61 147.43 1018.34 174.972C1018.06 202.513 1011.57 222.954 998.878 236.296C986.335 249.488 966.52 255.948 939.433 255.676L920.593 255.487C893.506 255.215 873.749 248.357 861.323 234.915C848.898 221.32 842.824 200.753 843.1 173.211C843.377 145.67 849.784 125.53 862.322 112.792C875.011 100.056 894.975 93.8244 922.214 94.098ZM924.415 168.807L924.15 195.138C924.131 197.105 924.644 198.699 925.691 199.92C926.89 201.143 928.397 201.764 930.213 201.782C932.18 201.802 933.775 201.212 934.998 200.014C936.372 198.817 937.069 197.235 937.089 195.267L937.353 168.937C937.371 167.121 936.706 165.601 935.356 164.377C934.157 163.154 932.574 162.533 930.607 162.513C928.791 162.495 927.272 163.085 926.049 164.283C924.978 165.483 924.433 166.991 924.415 168.807Z",
    R: "M780.031 164.074L778.986 191.749L788.06 192.091L788.651 176.439L842.261 176.418L839.394 252.409C823.162 253.159 801.359 253.018 773.988 251.985C746.767 250.958 726.233 243.293 712.386 228.989C698.69 214.691 692.353 194.007 693.374 166.938C694.395 139.869 702.178 120.248 716.721 108.075C731.264 95.9032 752.449 90.342 780.274 91.3919C791.314 91.8084 802.106 92.7457 812.652 94.2037C823.198 95.6617 831.022 97.017 836.124 98.2696L843.549 100.14L841.05 166.377L780.031 164.074Z",
    R2: "M640.28 245.982C623.965 245.006 612.585 241.369 606.139 235.071C599.703 228.622 596.891 218.6 597.704 205.004C598.517 191.409 602.495 181.944 609.636 176.61C616.928 171.285 628.656 169.106 644.82 170.073C661.135 171.048 672.59 174.69 679.187 180.997C685.944 187.162 688.915 197.042 688.102 210.638C687.298 224.083 683.241 233.618 675.931 239.245C668.629 244.721 656.746 246.967 640.28 245.982Z",
    I: "M475.8 73.9688L602.48 84.5436L596.985 150.372L548.123 146.293L547.367 155.341L596.229 159.42L595.04 173.672L546.178 169.593L545.422 178.641L596.32 182.89L591.467 241.027L462.752 230.282L475.8 73.9688Z",
    L: "M316.822 54.7471L398.168 64.6529C423.256 67.7079 441.678 76.0493 453.434 89.677C465.34 103.323 469.638 123.741 466.327 150.932C459.924 203.51 429.833 226.525 376.053 219.976L297.861 210.454L316.822 54.7471ZM384.55 129.54L379.803 168.523L386.112 169.291C387.915 169.51 389.49 169.092 390.838 168.037C392.337 167 393.205 165.505 393.443 163.552L396.626 137.413C396.845 135.61 396.352 134.026 395.147 132.659C394.091 131.311 392.662 130.527 390.859 130.308L384.55 129.54Z",
    L2: "M229.015 35.9756L247.529 39.4671C274.298 44.515 292.587 54.5091 302.398 69.4492C312.208 84.3894 314.562 105.392 309.458 132.458C304.354 159.523 294.382 178.51 279.543 189.418C264.881 200.205 244.24 203.089 217.62 198.069L199.106 194.577C172.486 189.557 154.239 179.34 144.364 163.926C134.516 148.363 132.145 127.048 137.249 99.9828C142.353 72.9172 152.194 54.2139 166.772 43.873C181.499 33.5601 202.247 30.9277 229.015 35.9756ZM218.075 109.912L213.195 135.788C212.831 137.721 213.057 139.381 213.873 140.767C214.839 142.181 216.214 143.056 217.998 143.393C219.931 143.757 221.605 143.457 223.019 142.491C224.582 141.554 225.545 140.119 225.91 138.186L230.79 112.31C231.126 110.525 230.738 108.912 229.623 107.47C228.658 106.056 227.209 105.166 225.276 104.802C223.491 104.465 221.892 104.78 220.478 105.745C219.212 106.738 218.411 108.127 218.075 109.912Z",
    A: "M89.723 78.5915L85.8253 90.4525C88.6062 91.6849 93.5909 93.4823 100.779 95.8445C114.294 100.285 126.512 103.823 137.435 106.456L142.752 107.726L121.563 172.206C106.011 172.512 85.3677 168.436 59.6329 159.979C34.0419 151.57 16.5669 138.58 7.20798 121.008C-2.00717 103.484 -2.38638 81.855 6.07032 56.1202C14.5743 30.2416 27.5194 13.389 44.9058 5.56225C62.2921 -2.26447 84.2121 -1.83138 110.666 6.86155C121.736 10.4994 131.947 14.5715 141.298 19.0781C150.793 23.6318 157.412 27.2407 161.156 29.9047L166.988 33.9716L145.162 100.393C133.362 94.1265 114.883 86.8592 89.723 78.5915Z",
  },
  normal: {
    C: "M1703.62 152.818L1702.31 129.492H1689.01L1687.7 152.818H1619.03C1620.49 128.984 1623.47 104.568 1627.97 79.5702C1632.48 54.4275 1636.62 35.2435 1640.4 22.0182L1645.85 2.18018H1749.18C1750.78 7.41218 1752.81 14.6788 1755.28 23.9802C1757.75 33.2815 1761.39 51.1575 1766.18 77.6082C1770.98 103.914 1774.25 128.984 1775.99 152.818H1703.62ZM1692.28 75.4282L1690.54 109.436H1700.78L1699.26 75.4282H1692.28Z",
    O: "M1519.2 2.18018H1594.2V96.7922H1616.43V152.818H1519.2V2.18018Z",
    D: "M1416.11 2.18018H1491.1V96.7922H1513.33V152.818H1416.11V2.18018Z",
    E: "M1334.93 152.818V2.18018H1409.93V152.818H1334.93Z",
    DOT: "M1247.64 108.782V152.818H1172.65V2.18018H1251.79C1277.8 2.18018 1296.91 6.46751 1309.12 15.0422C1321.33 23.4715 1327.43 38.1502 1327.43 59.0782C1327.43 74.9195 1322.27 86.6188 1311.95 94.1762C1320.67 109.727 1327.29 129.274 1331.79 152.818H1260.07C1258.91 138.14 1256.87 125.205 1253.97 114.014L1252.44 108.782H1247.64ZM1247.64 91.1242H1253.97C1255.71 91.1242 1257.16 90.5428 1258.33 89.3802C1259.49 88.2175 1260.07 86.6915 1260.07 84.8022V71.7222C1260.07 69.8328 1259.49 68.3795 1258.33 67.3622C1257.16 66.1995 1255.71 65.6182 1253.97 65.6182H1247.64V91.1242Z",
    G: "M1085.36 108.782V152.818H1010.37V2.18018H1089.5C1115.52 2.18018 1134.63 6.46751 1146.84 15.0422C1159.05 23.4715 1165.15 38.1502 1165.15 59.0782C1165.15 74.9195 1159.99 86.6188 1149.67 94.1762C1158.39 109.727 1165.01 129.274 1169.51 152.818H1097.79C1096.63 138.14 1094.59 125.205 1091.68 114.014L1090.16 108.782H1085.36ZM1085.36 91.1242H1091.68C1093.43 91.1242 1094.88 90.5428 1096.04 89.3802C1097.21 88.2175 1097.79 86.6915 1097.79 84.8022V71.7222C1097.79 69.8328 1097.21 68.3795 1096.04 67.3622C1094.88 66.1995 1093.43 65.6182 1091.68 65.6182H1085.36V91.1242Z",
    O2: "M914.28 0H932.374C958.534 0 977.573 6.17667 989.49 18.53C1001.41 30.8833 1007.37 50.2853 1007.37 76.736C1007.37 103.187 1001.33 122.879 989.272 135.814C977.355 148.603 958.389 154.998 932.374 154.998H914.28C888.265 154.998 869.227 148.603 857.164 135.814C845.101 122.879 839.07 103.187 839.07 76.736C839.07 50.2853 845.029 30.8833 856.946 18.53C869.009 6.17667 888.12 0 914.28 0ZM917.114 71.722V97.01C917.114 98.8993 917.623 100.425 918.64 101.588C919.803 102.751 921.256 103.332 923 103.332C924.889 103.332 926.415 102.751 927.578 101.588C928.886 100.425 929.54 98.8993 929.54 97.01V71.722C929.54 69.978 928.886 68.5247 927.578 67.362C926.415 66.1993 924.889 65.618 923 65.618C921.256 65.618 919.803 66.1993 918.64 67.362C917.623 68.5247 917.114 69.978 917.114 71.722Z",
    R: "M776.102 70.196V96.792H784.822V81.75L836.27 79.788V152.818C820.719 154.126 799.791 154.78 773.486 154.78C747.326 154.78 727.343 148.167 713.536 134.942C699.875 121.717 693.044 102.097 693.044 76.082C693.044 50.0674 699.802 30.956 713.318 18.748C726.834 6.54004 746.963 0.436035 773.704 0.436035C784.313 0.436035 794.705 0.944702 804.878 1.96204C815.051 2.97937 822.609 3.9967 827.55 5.01404L834.744 6.54005V70.196H776.102Z",
    R2: "M644.985 154.78C629.289 154.78 618.171 151.946 611.631 146.278C605.091 140.465 601.821 131.018 601.821 117.938C601.821 104.858 605.091 95.5569 611.631 90.0342C618.317 84.5116 629.435 81.7502 644.985 81.7502C660.681 81.7502 671.872 84.5842 678.557 90.2522C685.388 95.7749 688.803 105.076 688.803 118.156C688.803 131.091 685.461 140.465 678.775 146.278C672.09 151.946 660.827 154.78 644.985 154.78Z",
    I: "M473.86 2.18018H595.941V65.6182H548.853V74.3382H595.941V88.0722H548.853V96.7922H597.903V152.818H473.86V2.18018Z",
    L: "M314.346 2.18018H393.044C417.314 2.18018 435.844 7.99351 448.634 19.6202C461.568 31.2468 468.036 50.2128 468.036 76.5182C468.036 127.385 442.021 152.818 389.992 152.818H314.346V2.18018ZM387.594 65.6182V103.332H393.698C395.442 103.332 396.895 102.751 398.058 101.588C399.366 100.426 400.02 98.8995 400.02 97.0102V71.7222C400.02 69.9782 399.366 68.5249 398.058 67.3622C396.895 66.1995 395.442 65.6182 393.698 65.6182H387.594Z",
    L2: "M218.255 0H236.349C262.509 0 281.548 6.17667 293.465 18.53C305.383 30.8833 311.341 50.2853 311.341 76.736C311.341 103.187 305.31 122.879 293.247 135.814C281.33 148.603 262.364 154.998 236.349 154.998H218.255C192.241 154.998 173.202 148.603 161.139 135.814C149.077 122.879 143.045 103.187 143.045 76.736C143.045 50.2853 149.004 30.8833 160.921 18.53C172.984 6.17667 192.095 0 218.255 0ZM221.089 71.722V97.01C221.089 98.8993 221.598 100.425 222.615 101.588C223.778 102.751 225.231 103.332 226.975 103.332C228.865 103.332 230.391 102.751 231.553 101.588C232.861 100.425 233.515 98.8993 233.515 97.01V71.722C233.515 69.978 232.861 68.5247 231.553 67.362C230.391 66.1993 228.865 65.618 226.975 65.618C225.231 65.618 223.778 66.1993 222.615 67.362C221.598 68.5247 221.089 69.978 221.089 71.722Z",
    A: "M83.058 71.722V83.712C85.9647 84.0027 91.0513 84.148 98.318 84.148C111.979 84.148 124.187 83.712 134.942 82.84L140.174 82.404V147.586C126.077 152.527 106.021 154.998 80.006 154.998C54.1367 154.998 34.2987 148.385 20.492 135.16C6.83067 121.935 0 102.315 0 76.3C0 50.14 6.758 30.8833 20.274 18.53C33.79 6.17667 53.9187 0 80.66 0C91.8507 0 102.387 0.654001 112.27 1.962C122.298 3.27 129.419 4.578 133.634 5.886L140.174 7.848V74.992C127.53 72.812 108.491 71.722 83.058 71.722Z",
  },
};

const PHYSICS_TAGS = [
  "HTML", "CSS", "JavaScript", "TypeScript", "GSAP", "Lenis",
  "React", "Next.js", "TanStack", "Redux", "Node.js",
  "Express", "MongoDB", "Git", "Figma",
];

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const FooterPage = ({ children, triggerRef, ...props }) => {
  const { theme } = useTheme();
  const footerRef = useRef(null);
  const objectContainerRef = useRef(null);
  const physicsInitialized = useRef(false);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const rafRef = useRef(null);
  const morphTlRef = useRef(null);

  // ── MorphSVG: dynamic import to avoid SSR ──────────────────────────────────
  useEffect(() => {
    let st = null;

    const setupMorph = async () => {
      // Dynamic import keeps MorphSVGPlugin out of the SSR bundle
      const { MorphSVGPlugin } = await import("gsap/MorphSVGPlugin");
      gsap.registerPlugin(MorphSVGPlugin);

      // Set all paths to the bent (starting) state
      Object.entries(logoPaths.bent).forEach(([key, d]) => {
        const el = document.getElementById(`footer-path-${key}`);
        if (el) el.setAttribute("d", d);
      });

      // Use the footer's sentinel sibling as the scroll trigger if provided,
      // otherwise fall back to the footer element itself
      const triggerEl = triggerRef?.current ?? footerRef.current;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      Object.entries(logoPaths.normal).forEach(([key, d]) => {
        tl.to(`#footer-path-${key}`, { morphSVG: d, ease: "power2.inOut" }, 0);
      });

      morphTlRef.current = tl;
    };

    setupMorph();

    return () => {
      morphTlRef.current?.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === triggerRef?.current || t.vars?.trigger === footerRef.current) {
          t.kill();
        }
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Matter.js: dynamic import, trigger on scroll enter ────────────────────
  useEffect(() => {
    const container = objectContainerRef.current;
    if (!container) return;

    const triggerEl = triggerRef?.current ?? footerRef.current;

    const st = ScrollTrigger.create({
      trigger: triggerEl,
      start: "top bottom",
      once: true,
      onEnter: () => {
        if (physicsInitialized.current) return;
        physicsInitialized.current = true;
        initPhysics(container);
      },
    });

    return () => {
      st.kill();
      cleanupPhysics();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cleanupPhysics = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (runnerRef.current) {
      import("matter-js").then(({ default: Matter }) => {
        Matter.Runner.stop(runnerRef.current);
        if (engineRef.current) Matter.Engine.clear(engineRef.current);
      });
    }
  };

  const initPhysics = async (container) => {
    // Dynamic import — Matter.js uses browser APIs, cannot run on server
    const Matter = (await import("matter-js")).default;

    const rect = container.getBoundingClientRect();
    const T = 200;

    const engine = Matter.Engine.create();
    engine.gravity = { x: 0, y: 1 };
    engineRef.current = engine;

    // Boundary walls: floor, left, right
    const walls = [
      Matter.Bodies.rectangle(rect.width / 2, rect.height + T / 2, rect.width + T * 2, T, { isStatic: true }),
      Matter.Bodies.rectangle(-T / 2, rect.height / 2, T, rect.height + T * 2, { isStatic: true }),
      Matter.Bodies.rectangle(rect.width + T / 2, rect.height / 2, T, rect.height + T * 2, { isStatic: true }),
    ];
    Matter.World.add(engine.world, walls);

    // Add ceiling after 3s to cap the simulation
    setTimeout(() => {
      const ceiling = Matter.Bodies.rectangle(rect.width / 2, -T / 2, rect.width + T * 2, T, { isStatic: true });
      Matter.World.add(engine.world, ceiling);
    }, 3000);

    // Build a physics body for each tag element
    const tagEls = container.querySelectorAll(".physics-tag");
    const bodies = [];

    tagEls.forEach((el, i) => {
      const elRect = el.getBoundingClientRect();
      const startX = Math.random() * (rect.width - elRect.width) + elRect.width / 2;
      const startY = -220 - i * 90;
      const body = Matter.Bodies.rectangle(startX, startY, elRect.width, elRect.height, {
        restitution: 0.45,
        friction: 0.15,
        frictionAir: 0.022,
        density: 0.002,
        chamfer: { radius: 40 },
      });
      Matter.Body.setAngle(body, (Math.random() - 0.5) * Math.PI);
      bodies.push({ body, el, w: elRect.width, h: elRect.height });
      Matter.World.add(engine.world, body);
    });

    // Mouse interaction
    const mouse = Matter.Mouse.create(container);
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.6, render: { visible: false } },
    });

    let dragging = null;
    let origInertia = null;

    Matter.Events.on(mouseConstraint, "startdrag", (e) => {
      dragging = e.body;
      if (dragging) {
        origInertia = dragging.inertia;
        Matter.Body.setInertia(dragging, Infinity);
        Matter.Body.setVelocity(dragging, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(dragging, 0);
      }
    });
    Matter.Events.on(mouseConstraint, "enddrag", () => {
      if (dragging) {
        Matter.Body.setInertia(dragging, origInertia || 1);
        dragging = null;
      }
    });
    Matter.Events.on(engine, "beforeUpdate", () => {
      if (!dragging) return;
      const found = bodies.find((b) => b.body === dragging);
      if (!found) return;
      Matter.Body.setPosition(dragging, {
        x: clamp(dragging.position.x, found.w / 2, rect.width - found.w / 2),
        y: clamp(dragging.position.y, found.h / 2, rect.height - found.h / 2),
      });
      Matter.Body.setVelocity(dragging, {
        x: clamp(dragging.velocity.x, -20, 20),
        y: clamp(dragging.velocity.y, -20, 20),
      });
    });

    container.addEventListener("mouseleave", () => {
      mouseConstraint.constraint.bodyB = null;
      mouseConstraint.constraint.pointB = null;
    });
    document.addEventListener("mouseup", () => {
      mouseConstraint.constraint.bodyB = null;
      mouseConstraint.constraint.pointB = null;
    });

    Matter.World.add(engine.world, mouseConstraint);

    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // RAF loop syncs Matter body positions → DOM elements
    const tick = () => {
      bodies.forEach(({ body, el, w, h }) => {
        const x = clamp(body.position.x - w / 2, 0, rect.width - w);
        const y = clamp(body.position.y - h / 2, -h * 2, rect.height - h);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `rotate(${body.angle}rad)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const isDark = theme !== "light";

  return (
    <footer
      {...props}
      ref={footerRef}
      className={`fixed bottom-0 left-0 w-full h-screen -z-10 flex flex-col justify-end transition-colors duration-500 overflow-hidden ${
        props.className || ""
      } ${isDark ? "bg-brand-blue" : "bg-white"}`}
    >
      {/* Physics tags container — absolute fill, pointer-events delegated per-tag */}
      <div
        ref={objectContainerRef}
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      >
        {PHYSICS_TAGS.map((tag) => (
          <div
            key={tag}
            className={`physics-tag absolute font-main font-semibold text-sm px-6 py-3 rounded-full cursor-grab active:cursor-grabbing select-none z-10 whitespace-nowrap ${
              isDark ? "bg-brand-yellow text-black" : "bg-brand-orange text-white"
            }`}
            style={{ pointerEvents: "auto" }}
          >
            {tag}
          </div>
        ))}
      </div>

      {/* SVG morph logo — scroll-scrubbed bent→normal */}
      <div className={`relative z-10 w-full px-6 md:px-10 pb-6 ${isDark ? "text-white" : "text-brand-orange"}`}>
        <svg
          width="1813"
          height="256"
          viewBox="0 0 1813 256"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          aria-label="code.gorrilla"
        >
          <g id="code-gorrilla-logo">
            <path id="footer-path-C"   d="" fill="currentColor" />
            <path id="footer-path-O"   d="" fill="currentColor" />
            <path id="footer-path-D"   d="" fill="currentColor" />
            <path id="footer-path-E"   d="" fill="currentColor" />
            <path id="footer-path-DOT" d="" fill="currentColor" />
            <path id="footer-path-G"   d="" fill="currentColor" />
            <path id="footer-path-O2"  d="" fill="currentColor" />
            <path id="footer-path-R"   d="" fill="currentColor" />
            <path id="footer-path-R2"  d="" fill="currentColor" />
            <path id="footer-path-I"   d="" fill="currentColor" />
            <path id="footer-path-L"   d="" fill="currentColor" />
            <path id="footer-path-L2"  d="" fill="currentColor" />
            <path id="footer-path-A"   d="" fill="currentColor" />
          </g>
        </svg>

        <p className={`text-xs font-mono mt-4 opacity-40 text-center tracking-widest uppercase ${
          isDark ? "text-white" : "text-black"
        }`}>
          Development made with GSAP · Lenis · Matter.js · Next.js
        </p>
      </div>

      <div className="w-full px-10">{children}</div>
    </footer>
  );
};

export default FooterPage;
