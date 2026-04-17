"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Store scroll progress globally for Three.js access
let globalScrollProgress = 0;

export function setScrollProgress(v: number) {
  globalScrollProgress = v;
}

function Particles() {
  const mesh = useRef<THREE.Points>(null);
  const count = 800;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    return [pos, vel];
  }, []);

  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const accent = new THREE.Color("#FF5500");
    const muted = new THREE.Color("#D8D8D0");
    for (let i = 0; i < count; i++) {
      const color = Math.random() < 0.12 ? accent : muted;
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return c;
  }, []);

  useFrame(() => {
    if (!mesh.current) return;
    const posAttr = mesh.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      if (Math.abs(arr[i * 3]) > 12) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 12) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 7) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---- Morphing central object that transforms with scroll ---- */
function ScrollMorphObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor1: { value: new THREE.Color("#FF5500") },
      uColor2: { value: new THREE.Color("#0A0A0A") },
      uColor3: { value: new THREE.Color("#F7F6F2") },
    }),
    []
  );

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uScroll;

    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x2_ = x_ * ns.x + ns.yyyy;
      vec4 y2_ = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x2_) - abs(y2_);
      vec4 b0 = vec4(x2_.xy, y2_.xy);
      vec4 b1 = vec4(x2_.zw, y2_.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      float noiseFreq = 1.5 + uScroll * 2.0;
      float noiseAmp = 0.12 + uScroll * 0.15;
      float noise = snoise(position * noiseFreq + uTime * 0.25) * noiseAmp;
      float noise2 = snoise(position * 3.0 + uTime * 0.4) * 0.04;
      vec3 newPos = position + normal * (noise + noise2);
      vPosition = newPos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float uTime;
    uniform float uScroll;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;

    void main() {
      float fresnel = pow(1.0 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 2.5);
      float scrollMix = uScroll;
      vec3 baseColor = mix(uColor2, uColor1, scrollMix);
      vec3 color = mix(baseColor, uColor3, fresnel * 0.5);
      float pattern = sin(vPosition.x * 8.0 + uTime) * sin(vPosition.y * 8.0 + uTime * 0.5) * 0.1;
      color += pattern;
      float alpha = 0.6 + fresnel * 0.4;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const s = globalScrollProgress;

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t;
      matRef.current.uniforms.uScroll.value = s;
    }

    if (meshRef.current) {
      // Scroll-driven position: moves from right to center to left
      meshRef.current.position.x = THREE.MathUtils.lerp(3, -3, s);
      meshRef.current.position.y = Math.sin(s * Math.PI * 2) * 0.5;
      meshRef.current.rotation.y = t * 0.08 + s * Math.PI * 3;
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.1 + s * 0.5;
      // Scale morphs with scroll
      const sc = 1.0 + Math.sin(s * Math.PI) * 0.4;
      meshRef.current.scale.setScalar(sc);
    }

    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI * 0.5 + Math.sin(t * 0.15) * 0.2;
      ringRef.current.rotation.z = t * 0.1 + s * Math.PI;
      ringRef.current.scale.setScalar(1.0 + s * 0.3);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.12 + s * Math.PI * 0.5;
      ring2Ref.current.rotation.x = Math.PI * 0.3 + Math.cos(t * 0.1) * 0.15;
      ring2Ref.current.scale.setScalar(1.0 + s * 0.2);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={[3, 0, 0]}>
        <icosahedronGeometry args={[1.6, 48]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[2.8, 0.015, 16, 120]} />
        <meshBasicMaterial color="#D8D8D0" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#FF5500" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

/* ---- Camera that moves with scroll ---- */
function ScrollCamera() {
  const { camera } = useThree();

  useFrame(() => {
    const s = globalScrollProgress;
    // Camera orbit path
    camera.position.x = Math.sin(s * Math.PI * 0.5) * 2;
    camera.position.y = Math.sin(s * Math.PI) * 1.5;
    camera.position.z = 6 - s * 1.5;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function ParticleField() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen to scroll
  useEffect(() => {
    if (!mounted) return;
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      globalScrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#FF5500" />
        <pointLight position={[-5, -3, 3]} intensity={0.3} color="#F7F6F2" />
        <Particles />
        <ScrollMorphObject />
        <ScrollCamera />
      </Canvas>
    </div>
  );
}
