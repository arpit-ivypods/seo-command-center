import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { colors, fonts, sampleData } from '../../theme';
import Panel from '../shared/Panel';
import useBreakpoint from '../../hooks/useBreakpoint';

const CustomDot = (props) => {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#00F0FF"
      stroke="#080c10"
      strokeWidth={2}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: 'rgba(17,24,34,0.95)',
        border: `1px solid ${colors.borderDefault}`,
        borderRadius: 6,
        padding: '6px 10px',
      }}
    >
      <div
        style={{
          fontFamily: fonts.primary,
          fontSize: 10,
          color: colors.textSecondary,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: 13,
          color: colors.cyan,
        }}
      >
        {payload[0].value}
      </div>
    </div>
  );
};

export default function MarketIntel({ delay = 0 }) {
  const bp = useBreakpoint();

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
          2. MARKET INTEL
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 600,
          fontSize: 12,
          color: colors.textPrimary,
          marginBottom: 2,
          paddingLeft: 14,
        }}
      >
        Market Opportunity Index
      </div>
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 400,
          fontSize: 10,
          color: colors.textSecondary,
          marginBottom: 12,
          paddingLeft: 14,
        }}
      >
        Volume Forecast
      </div>

      {/* Line Chart */}
      <div style={{ width: '100%', height: bp === 'mobile' ? 120 : 160 }}>
        <style>
          {`
            .market-intel-line {
              filter: drop-shadow(0 0 6px rgba(0,240,255,0.5));
            }
          `}
        </style>
        <div style={{ filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.4))', width: '100%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={sampleData.marketIntel}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="marketAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(0,240,255,0.25)" />
                <stop offset="100%" stopColor="rgba(0,240,255,0)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(0,240,255,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{
                fontFamily: fonts.mono,
                fontWeight: 400,
                fontSize: 10,
                fill: colors.textMuted,
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 150]}
              tick={{
                fontFamily: fonts.mono,
                fontWeight: 400,
                fontSize: 10,
                fill: colors.textMuted,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors.cyan}
              strokeWidth={2.5}
              fill="url(#marketAreaGradient)"
              dot={<CustomDot />}
              className="market-intel-line"
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>
    </Panel>
  );
}
