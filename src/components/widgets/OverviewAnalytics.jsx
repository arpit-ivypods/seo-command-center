import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import Panel from '../shared/Panel';
import { colors, fonts, sampleData } from '../../theme';
import useAnimatedCounter from '../../hooks/useAnimatedCounter';
import useBreakpoint from '../../hooks/useBreakpoint';

const trafficData = sampleData.trafficChart.map((v, i) => ({ x: i, value: v }));
const conversionData = sampleData.conversionChart.map((v, i) => ({ x: i, value: v }));

function TrendBadge({ value }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(40,199,111,0.15)',
        color: colors.green,
        fontFamily: fonts.primary,
        fontWeight: 600,
        fontSize: 10,
        borderRadius: 10,
        padding: '2px 8px',
        marginLeft: 8,
        lineHeight: 1.4,
      }}
    >
      {value}
    </span>
  );
}

function MiniAreaChart({ data, lineColor, fillColorTop, glowColor, height = 80 }) {
  const gradientId = `grad-${lineColor.replace('#', '')}`;

  return (
    <div style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}>
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColorTop} stopOpacity={1} />
            <stop offset="100%" stopColor={fillColorTop} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="x" hide />
        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
        <Tooltip
          contentStyle={{
            background: colors.bgPanel,
            border: `1px solid ${colors.borderDefault}`,
            borderRadius: 6,
            fontSize: 11,
            fontFamily: fonts.mono,
            color: colors.textPrimary,
          }}
          labelFormatter={() => ''}
          formatter={(val) => [val, '']}
          cursor={false}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={lineColor}
          strokeWidth={2.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
    </div>
  );
}

function DonutGauge({ percent = 94, size = 100, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const filledLength = (percent / 100) * circumference;
  const dashArray = `${filledLength} ${circumference}`;
  const dashOffsetStart = circumference;
  const dashOffsetEnd = 0;

  const animatedPercent = useAnimatedCounter(percent, 1500, 200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Inner shadow ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(40,199,111,0.08)"
          strokeWidth={20}
        />
        {/* Track ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(40,199,111,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Fill arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.green}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={mounted ? dashOffsetEnd : dashOffsetStart}
          transform={`rotate(-90 ${center} ${center})`}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
            filter: 'drop-shadow(0 0 12px rgba(40,199,111,0.6))',
          }}
        />
        {/* Center number */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 28,
            fill: colors.green,
          }}
        >
          {animatedPercent}
        </text>
      </svg>
      <span
        style={{
          fontFamily: fonts.primary,
          fontWeight: 500,
          fontSize: 10,
          color: colors.textSecondary,
          marginTop: 4,
        }}
      >
        SEO Health Score
      </span>
    </div>
  );
}

const metricItems = [
  { label: 'Active Agents', value: '61', color: colors.cyan, textShadow: '0 0 10px rgba(0,240,255,0.4)' },
  { label: 'Data Processed', value: '1.2M', color: colors.purple, textShadow: '0 0 10px rgba(185,131,255,0.4)' },
  { label: 'Keywords Tracked', value: '45K', color: colors.orange, textShadow: '0 0 10px rgba(255,159,67,0.4)' },
];

function MetricsColumn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
      {metricItems.map((item) => (
        <div
          key={item.label}
          style={{
            borderLeft: `2px solid ${item.color}`,
            paddingLeft: 8,
          }}
        >
          <div
            style={{
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 20,
              color: item.color,
              textShadow: item.textShadow,
              lineHeight: 1.2,
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontFamily: fonts.primary,
              fontWeight: 400,
              fontSize: 9,
              color: colors.textMuted,
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OverviewAnalytics({ delay = 0 }) {
  const bp = useBreakpoint();
  const trafficCount = useAnimatedCounter(1421809, 1500, 200);

  const formattedTraffic = trafficCount.toLocaleString();

  const gridCols = bp === 'mobile' ? '1fr'
    : bp === 'tablet' ? '1fr 1fr'
    : '2fr 1.2fr 1.2fr 1.4fr';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: gridCols,
      gap: 14,
      height: '100%',
    }}>
      {/* Panel 1: Traffic */}
      <Panel delay={delay}>
        {/* Panel Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: fonts.primary,
            fontWeight: 700,
            fontSize: 13,
            color: colors.textPrimary,
            letterSpacing: '0.12em',
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: colors.cyan,
              boxShadow: `0 0 6px ${colors.cyan}`,
              flexShrink: 0,
            }}
          />
          OVERVIEW & ANALYTICS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div>
            <div
              style={{
                fontFamily: fonts.primary,
                fontWeight: 500,
                fontSize: 11,
                color: colors.textSecondary,
                marginBottom: 6,
              }}
            >
              Total Organic Traffic
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontWeight: 700,
                  fontSize: bp === 'mobile' ? 24 : 32,
                  color: colors.cyan,
                  textShadow: '0 0 20px rgba(0,240,255,0.5)',
                  lineHeight: 1,
                }}
              >
                {formattedTraffic}
              </span>
              <TrendBadge value="+12.5%" />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <MiniAreaChart
              data={trafficData}
              lineColor={colors.cyan}
              fillColorTop="rgba(0,240,255,0.25)"
              glowColor="rgba(0,240,255,0.3)"
            />
          </div>
        </div>
      </Panel>

      {/* Panel 2: Conversion */}
      <Panel delay={delay + 0.1}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div>
            <div
              style={{
                fontFamily: fonts.primary,
                fontWeight: 500,
                fontSize: 11,
                color: colors.textSecondary,
                marginBottom: 6,
              }}
            >
              Conversion Rate
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontWeight: 700,
                  fontSize: 28,
                  color: colors.purple,
                  textShadow: '0 0 20px rgba(185,131,255,0.5)',
                  lineHeight: 1,
                }}
              >
                74%
              </span>
              <TrendBadge value="+5.2%" />
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <MiniAreaChart
              data={conversionData}
              lineColor={colors.purple}
              fillColorTop="rgba(185,131,255,0.2)"
              glowColor="rgba(185,131,255,0.3)"
            />
          </div>
        </div>
      </Panel>

      {/* Panel 3: SEO Health & Metrics */}
      <Panel delay={delay + 0.2}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            flex: 1,
          }}
        >
          <DonutGauge percent={94} size={bp === 'mobile' ? 80 : 90} strokeWidth={12} />
          <MetricsColumn />
        </div>
      </Panel>

      {/* Panel 4: Optimization Queue */}
      <Panel delay={delay + 0.3}>
        <div style={{
          fontFamily: fonts.primary,
          fontWeight: 700,
          fontSize: 10,
          color: colors.textPrimary,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}>
          OPTIMIZATION QUEUE
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {sampleData.optimizationQueue.map((task, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 5,
                paddingBottom: 5,
                paddingRight: 0,
                paddingLeft: task.active ? 8 : 10,
                borderBottom: '1px solid rgba(0, 240, 255, 0.06)',
                borderLeft: task.active ? `2px solid ${colors.cyan}` : '2px solid transparent',
              }}
            >
              <span style={{
                fontFamily: fonts.primary,
                fontWeight: 400,
                fontSize: 10,
                color: colors.textSecondary,
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {task.task}
              </span>
              <span style={{
                fontFamily: fonts.mono,
                fontWeight: 500,
                fontSize: 10,
                color: colors.cyan,
                flexShrink: 0,
                marginRight: 8,
              }}>
                {task.time}
              </span>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: task.active ? colors.cyan : colors.textMuted,
                flexShrink: 0,
                animation: task.active ? 'pulse-cyan 2s ease-in-out infinite' : 'none',
                boxShadow: task.active ? `0 0 4px ${colors.cyanGlow}` : 'none',
              }} />
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
