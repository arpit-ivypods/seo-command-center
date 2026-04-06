import { useState } from 'react';
import { motion } from 'framer-motion';
import Panel from '../shared/Panel';
import { colors, fonts, sampleData } from '../../theme';
import useBreakpoint from '../../hooks/useBreakpoint';

/* ------------------------------------------------------------------ */
/*  Inject keyframes for pulse-cyan + custom scrollbar                 */
/* ------------------------------------------------------------------ */

const STYLE_ID = 'notifications-actions-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const sheet = document.createElement('style');
  sheet.id = STYLE_ID;
  sheet.textContent = `
    @keyframes pulse-cyan {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.5);
      }
      50% {
        box-shadow: 0 0 6px 3px rgba(0, 240, 255, 0.25);
      }
    }

    .notif-scroll::-webkit-scrollbar {
      width: 3px;
    }
    .notif-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .notif-scroll::-webkit-scrollbar-thumb {
      background: ${colors.cyan};
      border-radius: 3px;
    }
  `;
  document.head.appendChild(sheet);
}

/* ------------------------------------------------------------------ */
/*  Shared sub-header style                                            */
/* ------------------------------------------------------------------ */

const subHeaderStyle = {
  fontFamily: fonts.primary,
  fontWeight: 700,
  fontSize: 10,
  color: colors.textPrimary,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  lineHeight: 1.3,
  marginBottom: 2,
};

/* ------------------------------------------------------------------ */
/*  Section A: Agent Alert Feed                                        */
/* ------------------------------------------------------------------ */

function AlertRow({ alert, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
        padding: '3px 0',
        borderBottom: '1px solid rgba(0, 240, 255, 0.06)',
        background: hovered ? 'rgba(0, 240, 255, 0.04)' : 'transparent',
        transform: hovered ? 'translateX(2px)' : 'translateX(0)',
        transition: 'background 0.2s ease, transform 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Colored dot */}
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: alert.color,
          flexShrink: 0,
          marginTop: 1,
        }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            fontFamily: fonts.primary,
            fontWeight: 400,
            fontSize: 9,
            color: colors.textSecondary,
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'block',
          }}
        >
          {alert.text}
        </span>
      </div>

      {/* Timestamp */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontWeight: 400,
          fontSize: 9,
          color: colors.textMuted,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          marginTop: 2,
        }}
      >
        {alert.time}
      </span>
    </motion.div>
  );
}

function AgentAlertFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={subHeaderStyle}>AGENT ALERT FEED</div>
      <div className="notif-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {sampleData.alerts.map((alert, i) => (
          <AlertRow key={i} alert={alert} index={i} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section B: Action Center                                           */
/* ------------------------------------------------------------------ */

function ApproveButton() {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      style={{
        height: 22,
        padding: '0 10px',
        borderRadius: 11,
        border: `1px solid ${colors.cyan}`,
        background: 'transparent',
        color: colors.cyan,
        fontFamily: fonts.primary,
        fontWeight: 600,
        fontSize: 9,
        textTransform: 'uppercase',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.25s ease, box-shadow 0.25s ease',
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)';
        e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 240, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.25)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.background = 'rgba(0, 240, 255, 0.15)';
      }}
    >
      Approve
    </motion.button>
  );
}

function ActionCenter() {
  return (
    <div>
      <div style={subHeaderStyle}>ACTION CENTER</div>
      <div
        style={{
          fontFamily: fonts.primary,
          fontWeight: 400,
          fontSize: 10,
          color: colors.textSecondary,
          marginBottom: 4,
        }}
      >
        Recommended Optimizations
      </div>

      {sampleData.actions.map((action, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            background: 'rgba(0, 240, 255, 0.04)',
            borderRadius: 8,
            padding: '5px 8px',
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontFamily: fonts.primary,
              fontWeight: 400,
              fontSize: 9,
              color: colors.textSecondary,
              lineHeight: 1.4,
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {action.text}
          </span>
          <ApproveButton />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section C: Optimization Queue                                      */
/* ------------------------------------------------------------------ */

function QueueRow({ task }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 3,
        paddingBottom: 3,
        paddingRight: 0,
        paddingLeft: task.active ? 8 : 10,
        borderBottom: '1px solid rgba(0, 240, 255, 0.06)',
        borderLeft: task.active ? `2px solid ${colors.cyan}` : '2px solid transparent',
      }}
    >
      {/* Task name */}
      <span
        style={{
          fontFamily: fonts.primary,
          fontWeight: 400,
          fontSize: 9,
          color: colors.textSecondary,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {task.task}
      </span>

      {/* Time */}
      <span
        style={{
          fontFamily: fonts.mono,
          fontWeight: 500,
          fontSize: 11,
          color: colors.cyan,
          flexShrink: 0,
          marginRight: 10,
        }}
      >
        {task.time}
      </span>

      {/* Status dot */}
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: task.active ? colors.cyan : colors.textMuted,
          flexShrink: 0,
          animation: task.active ? 'pulse-cyan 2s ease-in-out infinite' : 'none',
          boxShadow: task.active
            ? `0 0 4px ${colors.cyanGlow}, 0 0 8px ${colors.cyanGlow}`
            : 'none',
        }}
      />
    </div>
  );
}

function OptimizationQueue() {
  return (
    <div>
      <div style={subHeaderStyle}>OPTIMIZATION QUEUE</div>
      <div>
        {sampleData.optimizationQueue.map((task, i) => (
          <QueueRow key={i} task={task} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Widget                                                    */
/* ------------------------------------------------------------------ */

export default function NotificationsActions({ delay } = {}) {
  const bp = useBreakpoint();

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: bp === 'mobile' ? 'auto auto' : '1fr 1fr',
      gap: 10,
      height: '100%',
    }}>
      {/* Panel 1: Agent Alert Feed */}
      <Panel delay={delay} style={{ minHeight: 0, overflow: 'hidden' }}>
        <AgentAlertFeed />
      </Panel>

      {/* Panel 2: Action Center */}
      <Panel delay={delay + 0.1} style={{ minHeight: 0, overflow: 'hidden' }}>
        <ActionCenter />
      </Panel>
    </div>
  );
}
