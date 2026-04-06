import React from 'react';
import { motion } from 'framer-motion';
import { colors, fonts, sampleData } from '../../theme';
import Panel from '../shared/Panel';

const barData = [
  { rank: 1, color: '#00F0FF', width: 92, grade: 'A+', sov: 38, sovColor: '#FF9F43' },
  { rank: 2, color: '#FF9F43', width: 78, grade: 'A', sov: 25, sovColor: '#FF9F43' },
  { rank: 3, color: '#B983FF', width: 65, grade: 'B+', sov: 18, sovColor: '#FFFFFF' },
  { rank: 4, color: '#4C8BFF', width: 50, grade: 'B', sov: 12, sovColor: '#FFFFFF' },
  { rank: 5, color: '#FF6B9D', width: 35, grade: 'C+', sov: 7, sovColor: '#FFFFFF' },
];

export default function CompetitorIntel({ delay = 0 }) {
  return (
    <Panel delay={delay}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
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
          3. COMPETITOR INTEL
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 500,
          fontSize: 11,
          color: colors.textSecondary,
          marginBottom: 14,
          paddingLeft: 14,
        }}
      >
        Top 5 Rival Rankings
      </div>

      {/* Horizontal Bar Chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {barData.map((bar, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {/* Rank label */}
            <span
              style={{
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 10,
                color: colors.textSecondary,
                width: 18,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              #{bar.rank}
            </span>

            {/* Bar */}
            <div
              style={{
                flex: 1,
                height: 18,
                background: 'rgba(0,240,255,0.05)',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bar.width}%` }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${bar.color}, ${bar.color}66)`,
                  boxShadow: `0 0 10px ${bar.color}40`,
                }}
              />
            </div>

            {/* Grade badge */}
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 20,
                height: 16,
                borderRadius: 4,
                background: `${bar.color}33`,
                border: `1px solid ${bar.color}55`,
                fontFamily: fonts.primary,
                fontWeight: 700,
                fontSize: 9,
                color: colors.textPrimary,
                flexShrink: 0,
              }}
            >
              {bar.grade}
            </span>

            {/* Share of Voice */}
            <span
              style={{
                fontFamily: fonts.mono,
                fontWeight: 700,
                fontSize: 13,
                color: bar.sovColor,
                width: 32,
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {bar.sov}%
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
