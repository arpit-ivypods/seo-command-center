import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts } from '../../theme';
import Panel from '../shared/Panel';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import useBreakpoint from '../../hooks/useBreakpoint';

const pipelineData = [
  {
    label: 'Drafts',
    value: 14,
    color: colors.cyan,
    bg: 'rgba(0,240,255,0.12)',
    textShadow: '0 0 12px rgba(0,240,255,0.5)',
  },
  {
    label: 'Optimized',
    value: 8,
    color: '#B983FF',
    bg: 'rgba(185,131,255,0.12)',
    textShadow: '0 0 12px rgba(185,131,255,0.5)',
  },
  {
    label: 'Published',
    value: 4,
    color: '#28C76F',
    bg: 'rgba(40,199,111,0.12)',
    textShadow: '0 0 12px rgba(40,199,111,0.5)',
  },
];

function PipelineCounter({ target, color, bg, label, delay, textShadow, fontSize = 32 }) {
  const count = useAnimatedCounter(target, 1000, delay);

  return (
    <div
      style={{
        flex: 1,
        background: bg,
        borderRadius: 8,
        padding: 12,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize,
          color,
          lineHeight: 1.1,
          textShadow,
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 400,
          fontSize: 10,
          color: colors.textSecondary,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function ContentIntel({ delay = 0 }) {
  const bp = useBreakpoint();
  const pipelineFontSize = bp === 'mobile' ? 24 : 32;

  return (
    <Panel delay={delay}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.cyan,
            boxShadow: `0 0 6px ${colors.cyanGlow}`,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: fonts.primary,
            fontWeight: 700,
            fontSize: 13,
            color: colors.textPrimary,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          4. CONTENT INTEL
        </span>
      </div>

      {/* Section A: Blog Engine */}
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 600,
          fontSize: 12,
          color: colors.textPrimary,
          marginBottom: 6,
        }}
      >
        Blog Engine
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: fonts.primary,
            fontWeight: 400,
            fontSize: 11,
            color: colors.textSecondary,
          }}
        >
          Content Performance
        </span>
        <span
          style={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 14,
            color: '#28C76F',
            textShadow: '0 0 8px rgba(40,199,111,0.4)',
          }}
        >
          94/100
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '100%',
          height: 8,
          borderRadius: 4,
          background: 'rgba(0,240,255,0.1)',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '94%' }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            height: '100%',
            borderRadius: 4,
            background: 'linear-gradient(90deg, #00F0FF, #28C76F)',
            boxShadow: '0 0 12px rgba(0,240,255,0.4), 0 0 4px rgba(40,199,111,0.3)',
          }}
        />
      </div>

      {/* Section B: Generation Pipeline */}
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 500,
          fontSize: 11,
          color: colors.textSecondary,
          marginBottom: 10,
        }}
      >
        Generation Pipeline
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {pipelineData.map((item, i) => (
          <PipelineCounter
            key={i}
            target={item.value}
            color={item.color}
            bg={item.bg}
            label={item.label}
            delay={i * 200}
            textShadow={item.textShadow}
            fontSize={pipelineFontSize}
          />
        ))}
      </div>
    </Panel>
  );
}
