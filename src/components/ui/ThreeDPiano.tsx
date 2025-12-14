import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * GrandPiano - A procedurally generated 3D grand piano model
 * Built with Three.js primitives for a classical, elegant look
 */
function GrandPiano() {
    const pianoRef = useRef<THREE.Group>(null);

    // Subtle auto-rotation
    useFrame((_, delta) => {
        if (pianoRef.current) {
            pianoRef.current.rotation.y += delta * 0.15; // Slow rotation
        }
    });

    return (
        <group ref={pianoRef} position={[0, -1, 0]} rotation={[0, Math.PI * 0.15, 0]}>
            {/* Piano Body - Main case */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[3, 0.8, 1.5]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>

            {/* Curved Lid Support - Left side */}
            <mesh position={[-1.2, 1.2, 0]} rotation={[0, 0, Math.PI * 0.15]} castShadow>
                <boxGeometry args={[0.15, 1.5, 1.3]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.9}
                    roughness={0.2}
                />
            </mesh>

            {/* Lid - Opened at an angle */}
            <mesh position={[-0.8, 1.5, 0]} rotation={[0, 0, Math.PI * 0.25]} castShadow>
                <boxGeometry args={[2.8, 0.1, 1.3]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.9}
                    roughness={0.15}
                />
            </mesh>

            {/* Keyboard - White keys base */}
            <mesh position={[1.3, 0.65, 0]} castShadow>
                <boxGeometry args={[0.8, 0.15, 1.2]} />
                <meshStandardMaterial
                    color="#f5f5f0"
                    metalness={0.1}
                    roughness={0.4}
                />
            </mesh>

            {/* Black keys accent */}
            <mesh position={[1.25, 0.75, 0]} castShadow>
                <boxGeometry args={[0.6, 0.08, 0.7]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.2}
                    roughness={0.3}
                />
            </mesh>

            {/* Piano Legs - Front Left */}
            <mesh position={[1.2, -0.4, 0.6]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.6, 16]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Piano Legs - Front Right */}
            <mesh position={[1.2, -0.4, -0.6]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.6, 16]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Piano Legs - Back Left */}
            <mesh position={[-1.3, -0.4, 0.6]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.6, 16]} />
                <meshStandardMaterial
                    color="#0a0a0a"
                    metalness={0.8}
                    roughness={0.3}
                />
            </mesh>

            {/* Pedals Base */}
            <mesh position={[1.3, -1.1, 0]} castShadow>
                <boxGeometry args={[0.4, 0.05, 0.6]} />
                <meshStandardMaterial
                    color="#b8860b"
                    metalness={0.95}
                    roughness={0.1}
                />
            </mesh>

            {/* Pedals - Left */}
            <mesh position={[1.3, -1.05, -0.15]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.95}
                    roughness={0.1}
                />
            </mesh>

            {/* Pedals - Center */}
            <mesh position={[1.3, -1.05, 0]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.95}
                    roughness={0.1}
                />
            </mesh>

            {/* Pedals - Right */}
            <mesh position={[1.3, -1.05, 0.15]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={0.95}
                    roughness={0.1}
                />
            </mesh>

            {/* Gold accent stripe on body */}
            <mesh position={[0, 0.92, 0.76]} castShadow>
                <boxGeometry args={[3.05, 0.02, 0.02]} />
                <meshStandardMaterial
                    color="#d4af37"
                    metalness={1.0}
                    roughness={0.05}
                    emissive="#d4af37"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </group>
    );
}

/**
 * ThreeDScene - Complete Three.js scene with piano, lights, and controls
 */
interface ThreeDSceneProps {
    autoRotate?: boolean;
    enableControls?: boolean;
}

export const ThreeDScene = ({
    autoRotate = true,
    enableControls = true
}: ThreeDSceneProps) => {
    return (
        <div className="w-full h-full bg-transparent">
            <Canvas
                shadows
                dpr={[1, 2]}
                gl={{
                    antialias: true,
                    alpha: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                }}
            >
                {/* Camera */}
                <PerspectiveCamera
                    makeDefault
                    position={[5, 3, 5]}
                    fov={50}
                />

                {/* Lights */}
                <ambientLight intensity={0.3} />

                {/* Key light - golden accent */}
                <spotLight
                    position={[5, 8, 5]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1.5}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                    color="#f2b90d"
                />

                {/* Fill light - subtle blue */}
                <spotLight
                    position={[-5, 5, -5]}
                    angle={0.4}
                    penumbra={1}
                    intensity={0.8}
                    color="#4a5a7a"
                />

                {/* Rim light - from behind */}
                <spotLight
                    position={[0, 4, -8]}
                    angle={0.5}
                    penumbra={1}
                    intensity={0.5}
                    color="#ffffff"
                />

                {/* The Piano */}
                <GrandPiano />

                {/* Ground plane with shadow */}
                <mesh
                    rotation={[-Math.PI / 2, 0, 0]}
                    position={[0, -2.25, 0]}
                    receiveShadow
                >
                    <planeGeometry args={[20, 20]} />
                    <shadowMaterial opacity={0.3} />
                </mesh>

                {/* Orbit Controls */}
                {enableControls && (
                    <OrbitControls
                        autoRotate={autoRotate}
                        autoRotateSpeed={0.5}
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2}
                        minDistance={6}
                        maxDistance={10}
                    />
                )}
            </Canvas>
        </div>
    );
};
