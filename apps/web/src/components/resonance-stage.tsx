"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import type { Group, Mesh } from "three";
import { Spotlight } from "@/components/ui/spotlight";

const strings = Array.from({ length: 13 }, (_, index) => {
  const x = (index - 6) * 0.19;
  return [[x, -1.45, 0], [x, 1.45, 0]] as [[number, number, number], [number, number, number]];
});

function ResonanceEngine() {
  const group = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  useEffect(() => {
    if (!group.current || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(group.current.rotation, {
      y: Math.PI * 1.4,
      x: Math.PI * 0.16,
      ease: "none",
      scrollTrigger: { trigger: ".hero-stage", start: "top top+=80", end: "bottom top", scrub: 1.2 },
    });
    return () => tween.scrollTrigger?.kill();
  }, [reduced]);

  useFrame((state, delta) => {
    if (!group.current || !core.current || reduced) return;
    group.current.rotation.z += delta * 0.035;
    core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.3) * 0.035);
  });

  return (
    <group ref={group} rotation={[0.12, -0.45, -0.15]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshStandardMaterial color="#742c3b" roughness={0.32} metalness={0.75} wireframe />
      </mesh>
      {[1.05, 1.38, 1.7].map((radius, index) => (
        <mesh key={radius} rotation={[index % 2 ? Math.PI / 2 : 0.35, index * 0.62, index * 0.25]}>
          <torusGeometry args={[radius, 0.018 + index * 0.006, 12, 120]} />
          <meshStandardMaterial color={index === 1 ? "#f2ebdd" : "#c3a15b"} metalness={0.9} roughness={0.22} />
        </mesh>
      ))}
      <group rotation={[0, 0, Math.PI / 2]}>
        {strings.map((points, index) => (
          <Line key={index} points={points} color={index % 3 === 0 ? "#e0c57d" : "#80735c"} lineWidth={index % 3 === 0 ? 1.15 : 0.55} transparent opacity={0.75} />
        ))}
      </group>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, Math.sin(angle * 2) * 0.35]}>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#c3a15b" emissive="#c3a15b" emissiveIntensity={1.5} />
          </mesh>
        );
      })}
    </group>
  );
}

export function ResonanceStage() {
  return (
    <div className="stage-frame" role="img" aria-label="Interactive abstract sculpture of strings, brass rings and a resonating core">
      <Spotlight
        className="stage-spotlight from-amber-100 via-amber-200 to-transparent"
        size={420}
        springOptions={{ stiffness: 170, damping: 24 }}
      />
      <div className="blueprint-grid" aria-hidden="true" />
      <Canvas camera={{ position: [0, 0, 5.4], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight color="#f2ebdd" position={[3, 4, 5]} intensity={2.6} />
        <pointLight color="#c3a15b" position={[-3, -2, 2]} intensity={22} distance={8} />
        <ResonanceEngine />
      </Canvas>
      <span className="stage-label">Resonance study · Move to illuminate</span>
    </div>
  );
}
