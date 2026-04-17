"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

let globalScrollProgress = 0;

export function setScrollProgress(v: number) {
  globalScrollProgress = v;
}

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 400;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vel[i * 3] = (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.0005;
    }
    return [pos, vel];
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const accent = new THREE.Color("#FF5500");
    const muted = new THREE.Color("#D8D8D0");
    for (let i = 0; i < count; i++) {
      const color = Math.random() < 0.08 ? accent : muted;
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return c;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    const posAttr = mesh.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      if (Math.abs(arr[i * 3]) > 15) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 15) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.25}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* Small subtle wireframe sphere — ambient decoration */
function AmbientSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = globalScrollProgress;

    if (meshRef.current) {
      meshRef.current.position.x = 5 - s * 10;
      meshRef.current.position.y = Math.sin(t * 0.2) * 0.3 + Math.sin(s * Math.PI) * 1;
      meshRef.current.rotation.y = t * 0.05 + s * Math.PI;
      meshRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
      const sc = 0.6 + Math.sin(s * Math.PI) * 0.15;
      meshRef.current.scale.setScalar(sc);
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.1) * 0.15;
      ringRef.current.rotation.z = t * 0.06;
      ringRef.current.position.x = meshRef.current?.position.x ?? 0;
      ringRef.current.position.y = meshRef.current?.position.y ?? 0;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[5, 0, 0]}>
        <icosahedronGeometry args={[0.8, 24]} />
        <meshStandardMaterial
          color="#D8D8D0"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.4, 0.008, 16, 80]} />
        <meshBasicMaterial color="#D8D8D0" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function ScrollCamera() {
  const { camera } = useThree();

  useFrame(() => {
    const s = globalScrollProgress;
    camera.position.x = Math.sin(s * Math.PI * 0.3) * 0.5;
    camera.position.y = Math.sin(s * Math.PI * 0.5) * 0.3;
    camera.position.z = 10;
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
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 5, 8]} intensity={0.3} color="#FF5500" />
        <Particles />
        <AmbientSphere />
        <ScrollCamera />
      </Canvas>
    </div>
  );
}
