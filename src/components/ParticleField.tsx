"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

let globalScrollProgress = 0;

const NODE_COUNT = 60;
const CONNECTION_DISTANCE = 2.8;

/* ---- Constellation Network: nodes + dynamic connections ---- */
function ConstellationNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Max possible line segments (each pair of nodes could connect)
  const maxLines = NODE_COUNT * 6;

  const { basePositions, velocities, nodeTypes } = useMemo(() => {
    const base = new Float32Array(NODE_COUNT * 3);
    const vel = new Float32Array(NODE_COUNT * 3);
    const types = new Uint8Array(NODE_COUNT); // 0=muted, 1=accent, 2=dark

    for (let i = 0; i < NODE_COUNT; i++) {
      // Spread nodes in a wide field, slightly concentrated toward center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 5;
      base[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // flatten Y
      base[i * 3 + 2] = r * Math.cos(phi) * 0.5;

      vel[i * 3] = (Math.random() - 0.5) * 0.004;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      // 15% accent nodes, 10% dark, rest muted
      const rng = Math.random();
      types[i] = rng < 0.15 ? 1 : rng < 0.25 ? 2 : 0;
    }
    return { basePositions: base, velocities: vel, nodeTypes: types };
  }, []);

  // Live positions (mutated each frame)
  const positions = useMemo(() => new Float32Array(basePositions), [basePositions]);

  // Node colors
  const nodeColors = useMemo(() => {
    const c = new Float32Array(NODE_COUNT * 3);
    const accent = new THREE.Color("#FF5500");
    const muted = new THREE.Color("#B8B8B0");
    const dark = new THREE.Color("#333333");
    for (let i = 0; i < NODE_COUNT; i++) {
      const col = nodeTypes[i] === 1 ? accent : nodeTypes[i] === 2 ? dark : muted;
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, [nodeTypes]);

  // Node sizes — accent nodes are bigger
  const nodeSizes = useMemo(() => {
    const s = new Float32Array(NODE_COUNT);
    for (let i = 0; i < NODE_COUNT; i++) {
      s[i] = nodeTypes[i] === 1 ? 0.07 : nodeTypes[i] === 2 ? 0.05 : 0.04;
    }
    return s;
  }, [nodeTypes]);

  // Line geometry (pre-allocated, updated each frame)
  const linePositions = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);
  const lineColors = useMemo(() => new Float32Array(maxLines * 6), [maxLines]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = globalScrollProgress;

    if (!pointsRef.current || !linesRef.current) return;

    // Animate node positions
    const posArr = positions;
    for (let i = 0; i < NODE_COUNT; i++) {
      const i3 = i * 3;
      // Drift
      posArr[i3] += velocities[i3];
      posArr[i3 + 1] += velocities[i3 + 1];
      posArr[i3 + 2] += velocities[i3 + 2];

      // Soft boundary bounce
      if (Math.abs(posArr[i3]) > 7) velocities[i3] *= -1;
      if (Math.abs(posArr[i3 + 1]) > 4.5) velocities[i3 + 1] *= -1;
      if (Math.abs(posArr[i3 + 2]) > 3.5) velocities[i3 + 2] *= -1;

      // Scroll influence: whole network shifts and breathes
      const scrollShift = Math.sin(s * Math.PI * 2 + i * 0.1) * 0.3;
      posArr[i3 + 1] += scrollShift * 0.01;
    }

    // Update points
    const pointGeo = pointsRef.current.geometry;
    (pointGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // Pulse accent node sizes
    const sizeAttr = pointGeo.attributes.size as THREE.BufferAttribute;
    const sizeArr = sizeAttr.array as Float32Array;
    for (let i = 0; i < NODE_COUNT; i++) {
      if (nodeTypes[i] === 1) {
        sizeArr[i] = 0.07 + Math.sin(t * 2 + i) * 0.02;
      }
    }
    sizeAttr.needsUpdate = true;

    // Build connection lines between nearby nodes
    let lineIdx = 0;
    const accent = new THREE.Color("#FF5500");
    const muted = new THREE.Color("#D8D8D0");
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();

    for (let i = 0; i < NODE_COUNT; i++) {
      if (lineIdx >= maxLines) break;
      tmpA.set(posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2]);

      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (lineIdx >= maxLines) break;
        tmpB.set(posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]);
        const dist = tmpA.distanceTo(tmpB);

        if (dist < CONNECTION_DISTANCE) {
          const li = lineIdx * 6;
          linePositions[li] = tmpA.x;
          linePositions[li + 1] = tmpA.y;
          linePositions[li + 2] = tmpA.z;
          linePositions[li + 3] = tmpB.x;
          linePositions[li + 4] = tmpB.y;
          linePositions[li + 5] = tmpB.z;

          // Color: if either node is accent, line gets accent tint
          const isAccent = nodeTypes[i] === 1 || nodeTypes[j] === 1;
          const col = isAccent ? accent : muted;
          const alpha = 1 - dist / CONNECTION_DISTANCE;
          lineColors[li] = col.r * alpha;
          lineColors[li + 1] = col.g * alpha;
          lineColors[li + 2] = col.b * alpha;
          lineColors[li + 3] = col.r * alpha;
          lineColors[li + 4] = col.g * alpha;
          lineColors[li + 5] = col.b * alpha;

          lineIdx++;
        }
      }
    }

    // Zero out remaining lines
    for (let i = lineIdx * 6; i < maxLines * 6; i++) {
      linePositions[i] = 0;
      lineColors[i] = 0;
    }

    const lineGeo = linesRef.current.geometry;
    (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx * 2);

    // Rotate whole constellation gently with scroll
    pointsRef.current.rotation.y = s * Math.PI * 0.6 + t * 0.02;
    linesRef.current.rotation.y = s * Math.PI * 0.6 + t * 0.02;
    pointsRef.current.rotation.x = Math.sin(s * Math.PI) * 0.15;
    linesRef.current.rotation.x = Math.sin(s * Math.PI) * 0.15;
  });

  return (
    <>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={NODE_COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} count={NODE_COUNT} itemSize={3} />
          <bufferAttribute attach="attributes-size" args={[nodeSizes, 1]} count={NODE_COUNT} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Connection lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} count={maxLines * 2} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[lineColors, 3]} count={maxLines * 2} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.35} depthWrite={false} />
      </lineSegments>
    </>
  );
}

/* ---- Floating code brackets — developer identity ---- */
function CodeSymbols() {
  const groupRef = useRef<THREE.Group>(null);

  // Create text-like shapes using simple geometries positioned as code symbols
  const symbols = useMemo(() => [
    { char: "</>", x: -5.5, y: 2.5, z: -2, scale: 0.4, speed: 0.3 },
    { char: "{}", x: 5, y: -2, z: -1.5, scale: 0.35, speed: 0.25 },
    { char: "//", x: -4, y: -3, z: -3, scale: 0.3, speed: 0.35 },
    { char: "=>", x: 6, y: 3, z: -2.5, scale: 0.3, speed: 0.2 },
    { char: "[]", x: -6, y: 0, z: -1, scale: 0.25, speed: 0.28 },
  ], []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const s = globalScrollProgress;

    groupRef.current.children.forEach((child, i) => {
      const sym = symbols[i];
      child.position.y = sym.y + Math.sin(t * sym.speed + i * 2) * 0.5;
      child.position.x = sym.x + Math.sin(t * sym.speed * 0.5 + i) * 0.3;
      child.rotation.y = Math.sin(t * 0.1 + i) * 0.3;
      child.rotation.z = Math.sin(t * 0.08 + i * 0.5) * 0.1;
      // Scroll fade: symbols drift and fade based on scroll
      const scrollFade = 1 - Math.abs(s - 0.5) * 0.5;
      child.scale.setScalar(sym.scale * scrollFade);
    });
  });

  return (
    <group ref={groupRef}>
      {symbols.map((sym, i) => (
        <group key={i} position={[sym.x, sym.y, sym.z]}>
          {/* Angle bracket < */}
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FF5500" : "#AAAAAA"}
              transparent
              opacity={0.4}
            />
          </mesh>
          <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FF5500" : "#AAAAAA"}
              transparent
              opacity={0.4}
            />
          </mesh>
          {/* Vertical bar | */}
          <mesh position={[0.1, 0, 0]}>
            <boxGeometry args={[0.04, 0.7, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FF5500" : "#AAAAAA"}
              transparent
              opacity={0.3}
            />
          </mesh>
          {/* Angle bracket > */}
          <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FF5500" : "#AAAAAA"}
              transparent
              opacity={0.4}
            />
          </mesh>
          <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.6, 0.04, 0.04]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FF5500" : "#AAAAAA"}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---- Grid plane that warps with scroll ---- */
function WarpGrid() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 30; // 30x30 grid
  const total = count * count;

  const positions = useMemo(() => {
    const pos = new Float32Array(total * 3);
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const idx = (i * count + j) * 3;
        pos[idx] = (j / count - 0.5) * 16;
        pos[idx + 1] = -4;
        pos[idx + 2] = (i / count - 0.5) * 10 - 2;
      }
    }
    return pos;
  }, []);

  const basePositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const s = globalScrollProgress;

    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < total; i++) {
      const bx = basePositions[i * 3];
      const bz = basePositions[i * 3 + 2];
      // Gentle wave that shifts with scroll
      arr[i * 3 + 1] = -4 + Math.sin(bx * 0.5 + t * 0.3 + s * 4) * 0.3
        + Math.cos(bz * 0.8 + t * 0.2) * 0.15;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={total}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#C8C8C0"
        transparent
        opacity={0.3}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---- Camera ---- */
function ScrollCamera() {
  const { camera } = useThree();

  useFrame(() => {
    const s = globalScrollProgress;
    camera.position.x = Math.sin(s * Math.PI * 0.5) * 1.5;
    camera.position.y = 0.5 + Math.sin(s * Math.PI) * 0.5;
    camera.position.z = 9 - s * 1.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function ParticleField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      globalScrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0.5, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <ConstellationNetwork />
        <CodeSymbols />
        <WarpGrid />
        <ScrollCamera />
      </Canvas>
    </div>
  );
}
