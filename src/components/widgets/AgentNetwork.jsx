import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Panel from '../shared/Panel';
import useBreakpoint from '../../hooks/useBreakpoint';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SATELLITES = [
  { id: 'consumer',   label: 'Consumer',   pos: [-1.8,  1.2, 0], color: '#28C76F', floatSpeed: 1.8, floatIntensity: 0.25 },
  { id: 'competitor', label: 'Competitor',  pos: [ 1.8,  1.2, 0], color: '#FF9F43', floatSpeed: 2.2, floatIntensity: 0.35 },
  { id: 'content',    label: 'Content',     pos: [ 1.8, -1.2, 0], color: '#B983FF', floatSpeed: 1.5, floatIntensity: 0.4  },
  { id: 'market',     label: 'Market',      pos: [-1.8, -1.2, 0], color: '#4C8BFF', floatSpeed: 2.5, floatIntensity: 0.2  },
];

const OUTER_NODES = [
  { pos: [ 0,    2.2, 0], color: '#00F0FF' },
  { pos: [ 2.5,  0,   0], color: '#FF9F43' },
  { pos: [ 0,   -2.2, 0], color: '#B983FF' },
  { pos: [-2.5,  0,   0], color: '#28C76F' },
  // 4 additional diagonal outer nodes for denser mesh
  { pos: [ 1.8,  1.8, 0], color: '#FF6B6B' },
  { pos: [-1.8,  1.8, 0], color: '#4ECDC4' },
  { pos: [ 1.8, -1.8, 0], color: '#FFE66D' },
  { pos: [-1.8, -1.8, 0], color: '#A8E6CF' },
];

const CENTER = [0, 0, 0];

/* Helper: euclidean distance between two [x,y,z] arrays */
function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

/* Build edge list: core-to-satellite, core-to-outer, satellite cross-links,
   satellite-to-nearest-outer, adjacent-outer-to-outer */
function buildEdges() {
  const edges = [];

  // Core to each satellite
  SATELLITES.forEach((s) => edges.push({ from: CENTER, to: s.pos, destColor: s.color }));

  // Core to each outer ring node
  OUTER_NODES.forEach((o) => edges.push({ from: CENTER, to: o.pos, destColor: o.color }));

  // Cross-links between satellites
  const byId = Object.fromEntries(SATELLITES.map((s) => [s.id, s]));
  const crossPairs = [
    ['consumer', 'competitor'],
    ['content',  'market'],
    ['consumer', 'market'],
    ['competitor','content'],
  ];
  crossPairs.forEach(([a, b]) => {
    edges.push({ from: byId[a].pos, to: byId[b].pos, destColor: byId[b].color });
  });

  // Each satellite to its nearest 2 outer nodes
  SATELLITES.forEach((s) => {
    const sorted = [...OUTER_NODES].sort((a, b) => dist(s.pos, a.pos) - dist(s.pos, b.pos));
    for (let i = 0; i < 2; i++) {
      edges.push({ from: s.pos, to: sorted[i].pos, destColor: sorted[i].color });
    }
  });

  // Adjacent outer nodes connected to each other (ring topology)
  for (let i = 0; i < OUTER_NODES.length; i++) {
    const next = (i + 1) % OUTER_NODES.length;
    edges.push({ from: OUTER_NODES[i].pos, to: OUTER_NODES[next].pos, destColor: OUTER_NODES[next].color });
  }

  return edges;
}

const EDGES = buildEdges();

/* ------------------------------------------------------------------ */
/*  Background Grid (subtle depth cue)                                */
/* ------------------------------------------------------------------ */

function BackgroundGrid() {
  const gridRef = useRef();

  const gridTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    ctx.lineWidth = 1;
    const step = size / 16;
    for (let i = 0; i <= 16; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }, []);

  return (
    <mesh ref={gridRef} position={[0, 0, -1]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        map={gridTexture}
        transparent
        opacity={0.5}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Central AI Core (hexagonal prism + glow rings + label)            */
/* ------------------------------------------------------------------ */

function AICore() {
  const hexRef = useRef();
  const ringRef = useRef();
  const ring2Ref = useRef();
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    if (hexRef.current) hexRef.current.rotation.y += (Math.PI * 2 * delta) / 20;
    if (ringRef.current) ringRef.current.rotation.z -= (Math.PI * 2 * delta) / 15;
    if (ring2Ref.current) ring2Ref.current.rotation.z += (Math.PI * 2 * delta) / 22;
    const target = hovered ? 1.2 : 1;
    scaleRef.current += (target - scaleRef.current) * Math.min(delta * 8, 1);
    if (hexRef.current) {
      const s = scaleRef.current;
      hexRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <group>
        {/* Hexagonal prism */}
        <mesh
          ref={hexRef}
          rotation={[Math.PI / 2, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[0.5, 0.5, 0.15, 6]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.5}
            metalness={0.3}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* AI label via HTML overlay for reliable rendering */}
        <Html center position={[0, 0, 0.09]} style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            color: 'white',
            textShadow: '0 0 8px rgba(0,240,255,0.6)',
            userSelect: 'none',
          }}>AI</div>
        </Html>

        {/* Primary glow ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={1.2}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Second larger glow ring for stronger halo */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#00F0FF"
            emissive="#00F0FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Hover tooltip */}
        {hovered && (
          <Html center style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <div style={{
              background: 'rgba(0,20,40,0.85)',
              color: '#00F0FF',
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              border: '1px solid rgba(0,240,255,0.3)',
              transform: 'translateY(-40px)',
            }}>
              AI Core
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/*  Satellite Node                                                     */
/* ------------------------------------------------------------------ */

function SatelliteNode({ position, color, label, floatSpeed, floatIntensity }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);

  useFrame((_, delta) => {
    const target = hovered ? 1.2 : 1;
    scaleRef.current += (target - scaleRef.current) * Math.min(delta * 8, 1);
    if (meshRef.current) {
      const s = scaleRef.current;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <Float speed={floatSpeed} rotationIntensity={0.1} floatIntensity={floatIntensity}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.0}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Label via HTML overlay */}
        <Html center position={[0, -0.45, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
            fontSize: 10,
            color: 'white',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}>{label}</div>
        </Html>

        {/* Hover tooltip */}
        {hovered && (
          <Html center style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            <div style={{
              background: 'rgba(0,20,40,0.85)',
              color,
              padding: '4px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              border: `1px solid ${color}44`,
              transform: 'translateY(-36px)',
            }}>
              {label} Intel Agent
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/*  Outer Ring Node (small, no label)                                  */
/* ------------------------------------------------------------------ */

function OuterNode({ position, color }) {
  return (
    <Float speed={1.8} rotationIntensity={0.05} floatIntensity={0.15}>
      <mesh position={position}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

/* ------------------------------------------------------------------ */
/*  Connection Lines                                                   */
/* ------------------------------------------------------------------ */

function ConnectionLines() {
  return (
    <group>
      {EDGES.map((edge, i) => (
        <Line
          key={i}
          points={[edge.from, edge.to]}
          color={edge.destColor}
          opacity={0.5}
          transparent
          lineWidth={1}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Data-Flow Particle (single sphere lerping along an edge)          */
/* ------------------------------------------------------------------ */

function FlowParticle({ from, to, color, speed, offset }) {
  const ref = useRef();
  const tRef = useRef(offset);
  const startVec = useMemo(() => new THREE.Vector3(...from), [from]);
  const endVec   = useMemo(() => new THREE.Vector3(...to),   [to]);

  useFrame((_, delta) => {
    tRef.current = (tRef.current + delta * speed) % 1;
    if (ref.current) {
      ref.current.position.lerpVectors(startVec, endVec, tRef.current);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.0}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  All Data-Flow Particles (kept under 50 total)                     */
/* ------------------------------------------------------------------ */

function DataFlowParticles() {
  const particles = useMemo(() => {
    const list = [];
    EDGES.forEach((edge, i) => {
      // Use 1 particle per edge to stay under 50 total with more edges
      const count = 1;
      const speed = 0.25 + (i % 5) * 0.03;        // 0.25 - 0.37
      for (let p = 0; p < count; p++) {
        list.push({
          key: `${i}-${p}`,
          from: edge.from,
          to: edge.to,
          color: edge.destColor,
          speed,
          offset: p / count,                        // stagger evenly
        });
      }
    });
    return list;
  }, []);

  return (
    <group>
      {particles.map((p) => {
        const { key, ...rest } = p;
        return <FlowParticle key={key} {...rest} />;
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Scene (all 3-D content assembled)                                 */
/* ------------------------------------------------------------------ */

function NetworkScene({ bp }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#00F0FF" />
      <pointLight position={[0, 2, 2]} intensity={0.4} color="#00F0FF" />
      <pointLight position={[-2, -1, 2]} intensity={0.5} color="#B983FF" />

      {/* Subtle background grid for depth */}
      <BackgroundGrid />

      {/* Connection lines (static) */}
      <ConnectionLines />

      {/* Central node */}
      <AICore />

      {/* Satellite agent nodes */}
      {SATELLITES.map((s) => (
        <SatelliteNode
          key={s.id}
          position={s.pos}
          color={s.color}
          label={s.label}
          floatSpeed={s.floatSpeed}
          floatIntensity={s.floatIntensity}
        />
      ))}

      {/* Outer ring nodes */}
      {OUTER_NODES.map((o, i) => (
        <OuterNode key={i} position={o.pos} color={o.color} />
      ))}

      {/* Data-flow particles */}
      <DataFlowParticles />

      {/* Post-processing bloom */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={bp === 'mobile' ? 1.0 : 2.5}
          radius={1.0}
        />
      </EffectComposer>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Widget                                                    */
/* ------------------------------------------------------------------ */

export default function AgentNetwork({ delay } = {}) {
  const bp = useBreakpoint();

  const canvasContainerStyle = bp === 'mobile'
    ? { height: 250, flexShrink: 0, position: 'relative' }
    : bp === 'tablet'
      ? { height: 300, position: 'relative' }
      : { flex: 1, minHeight: 0, position: 'relative' };

  return (
    <Panel delay={delay} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 12, flexShrink: 0 }}>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: 13,
          color: '#FFFFFF',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          lineHeight: 1.3,
        }}>
          MULTI-AGENT COORDINATION NETWORK
        </div>
        <div style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: 10,
          color: '#8899AA',
          marginTop: 2,
        }}>
          5 AI Agents in Real-time Sync
        </div>
      </div>

      {/* 3-D Canvas */}
      <div style={canvasContainerStyle}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          style={{ background: 'transparent' }}
          dpr={bp === 'mobile' ? [1, 1.5] : [1, 2]}
        >
          <NetworkScene bp={bp} />
        </Canvas>
      </div>
    </Panel>
  );
}
