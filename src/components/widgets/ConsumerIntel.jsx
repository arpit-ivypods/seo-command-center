import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, sampleData } from '../../theme';
import Panel from '../shared/Panel';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import useBreakpoint from '../../hooks/useBreakpoint';

const clusterBgs = [
  'rgba(40,199,111,0.15)',
  'rgba(255,159,67,0.15)',
  'rgba(185,131,255,0.15)',
  'rgba(0,240,255,0.12)',
];

/* ── Auto-layout Word Cloud ── */
function WordCloud({ words, minHeight = 100 }) {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);

  const computeLayout = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;
    if (W === 0 || H === 0) return;

    // Sort by size descending so largest words are placed first
    const sorted = words.map((w, i) => ({ ...w, idx: i }))
      .sort((a, b) => b.size - a.size);

    // Estimate text dimensions (approx 0.6 * fontSize per char for Inter)
    const estimateWidth = (text, size, bold) => text.length * size * (bold ? 0.62 : 0.55);
    const estimateHeight = (size) => size * 1.2;

    const placed = []; // { x, y, w, h }

    const overlaps = (x, y, w, h) =>
      placed.some(p =>
        x < p.x + p.w + 4 && x + w + 4 > p.x &&
        y < p.y + p.h + 2 && y + h + 2 > p.y
      );

    const result = new Array(words.length);

    for (const word of sorted) {
      const tw = estimateWidth(word.word, word.size, word.bold);
      const th = estimateHeight(word.size);

      // Spiral outward from center to find a non-overlapping spot
      const cx = (W - tw) / 2;
      const cy = (H - th) / 2;
      let found = false;

      for (let t = 0; t < 600; t++) {
        const angle = t * 0.15;
        const radius = t * 0.6;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle) * 0.6; // flatten spiral vertically

        // Bounds check
        if (x < 0 || y < 0 || x + tw > W || y + th > H) continue;

        if (!overlaps(x, y, tw, th)) {
          placed.push({ x, y, w: tw, h: th });
          result[word.idx] = { x, y };
          found = true;
          break;
        }
      }

      if (!found) {
        // Fallback: place off-center
        result[word.idx] = { x: Math.random() * (W - tw), y: Math.random() * (H - th) };
      }
    }

    setPositions(result);
  }, [words]);

  useEffect(() => {
    // Delay to let container mount and get dimensions
    const timer = setTimeout(computeLayout, 100);
    const observer = new ResizeObserver(computeLayout);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [computeLayout]);

  return (
    <div ref={containerRef} style={{
      position: 'relative',
      flex: 1,
      minHeight,
      overflow: 'hidden',
    }}>
      {words.map((item, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.6, 1.0, 0.6], scale: 1 }}
            transition={{
              opacity: { duration: 3, repeat: Infinity, delay: i * 0.25, ease: 'easeInOut' },
              scale: { duration: 0.5, delay: i * 0.05 },
            }}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              fontFamily: fonts.primary,
              fontSize: item.size,
              fontWeight: item.bold ? 700 : 400,
              color: item.color,
              whiteSpace: 'nowrap',
              lineHeight: 1.2,
              cursor: 'default',
              transition: 'text-shadow 0.2s',
            }}
            whileHover={{
              scale: 1.1,
              textShadow: `0 0 12px ${item.color}`,
            }}
          >
            {item.word}
          </motion.span>
        );
      })}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: fonts.primary,
      fontWeight: 600,
      fontSize: 11,
      color: colors.textSecondary,
      letterSpacing: '0.03em',
      marginBottom: 10,
      textTransform: 'uppercase',
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div style={{
      height: 1,
      background: 'linear-gradient(90deg, rgba(0,240,255,0.12), rgba(0,240,255,0.03))',
      margin: '14px 0',
    }} />
  );
}

export default function ConsumerIntel({ delay = 0 }) {
  const bp = useBreakpoint();
  const [hoveredCard, setHoveredCard] = useState(null);
  const organicTraffic = useAnimatedCounter(1421809, 1400, 0);
  const ranking = useAnimatedCounter(94, 1000, 200);

  return (
    <Panel delay={delay} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: colors.cyan,
          boxShadow: `0 0 8px ${colors.cyanGlow}`,
          flexShrink: 0,
        }} />
        <span style={{
          fontFamily: fonts.primary,
          fontWeight: 700,
          fontSize: 13,
          color: colors.textPrimary,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          1. Consumer Intel
        </span>
      </div>

      {/* ── Section A: Audience Query Clusters ── */}
      <SectionTitle>Audience Query Clusters</SectionTitle>
      <div style={{
        display: 'grid',
        gridTemplateColumns: bp === 'mobile' ? '1fr' : '1fr 1fr',
        gap: 8,
      }}>
        {sampleData.queryClusters.map((cluster, i) => {
          const hovered = hoveredCard === i;
          return (
            <motion.div
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              animate={{
                y: hovered ? -2 : 0,
                borderColor: hovered ? cluster.color : 'transparent',
              }}
              transition={{ duration: 0.2 }}
              style={{
                background: clusterBgs[i],
                borderRadius: 8,
                padding: '10px 12px',
                minHeight: 54,
                boxSizing: 'border-box',
                position: 'relative',
                cursor: 'default',
                border: '1px solid transparent',
              }}
            >
              <span style={{
                fontFamily: fonts.primary,
                fontWeight: 400,
                fontSize: 10,
                color: colors.textPrimary,
                lineHeight: '15px',
                display: 'block',
                paddingRight: 34,
              }}>
                {cluster.text}
              </span>
              <span style={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontFamily: fonts.mono,
                fontWeight: 600,
                fontSize: 10,
                color: cluster.color,
                background: `${cluster.color}20`,
                border: `1px solid ${cluster.color}30`,
                borderRadius: 4,
                padding: '2px 6px',
                lineHeight: 1,
              }}>
                {cluster.difficulty}%
              </span>
            </motion.div>
          );
        })}
      </div>

      <Divider />

      {/* ── Section B: Top Blog Keyword Insights ── */}
      <SectionTitle>Top Blog Keyword Insights</SectionTitle>
      <WordCloud words={sampleData.wordCloud} minHeight={bp === 'mobile' ? 80 : 100} />

      <Divider />

      {/* ── Section C: Quick Stats ── */}
      <div style={{
        display: 'flex',
        background: 'rgba(0,240,255,0.03)',
        borderRadius: 8,
        padding: '12px 0',
      }}>
        {/* Organic Traffic */}
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid rgba(0,240,255,0.1)' }}>
          <div style={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 14,
            color: colors.cyan,
            textShadow: '0 0 10px rgba(0,240,255,0.5)',
            lineHeight: 1.2,
          }}>
            {organicTraffic.toLocaleString()}
          </div>
          <div style={{
            fontFamily: fonts.primary,
            fontWeight: 400,
            fontSize: 9,
            color: colors.textMuted,
            marginTop: 4,
          }}>
            Organic Traffic
          </div>
        </div>

        {/* Ranking */}
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid rgba(0,240,255,0.1)' }}>
          <div style={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 14,
            color: colors.green,
            textShadow: '0 0 10px rgba(40,199,111,0.5)',
            lineHeight: 1.2,
          }}>
            {ranking}
          </div>
          <div style={{
            fontFamily: fonts.primary,
            fontWeight: 400,
            fontSize: 9,
            color: colors.textMuted,
            marginTop: 4,
          }}>
            Ranking #1
          </div>
        </div>

        {/* Priority */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 13,
            color: colors.purple,
            textShadow: '0 0 10px rgba(185,131,255,0.5)',
            background: 'rgba(185,131,255,0.15)',
            border: '1px solid rgba(185,131,255,0.2)',
            borderRadius: 4,
            padding: '2px 10px',
            display: 'inline-block',
            lineHeight: 1.3,
          }}>
            P1
          </span>
          <div style={{
            fontFamily: fonts.primary,
            fontWeight: 400,
            fontSize: 9,
            color: colors.textMuted,
            marginTop: 4,
          }}>
            Priority
          </div>
        </div>
      </div>
    </Panel>
  );
}
