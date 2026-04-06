import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  BarChart3,
  Shield,
  PenTool,
  FileText,
  Settings,
  AlertTriangle,
} from 'lucide-react';
import { colors } from '../../theme';
import useBreakpoint from '../../hooks/useBreakpoint';

const navItems = [
  { id: 'consumer', icon: Eye, label: 'Consumer Intel', agents: '12 Active Agents' },
  { id: 'market', icon: BarChart3, label: 'Market Intel', agents: '8 Active Agents' },
  { id: 'competitor', icon: Shield, label: 'Competitor Intel', agents: '15 Active Agents' },
  { id: 'content', icon: PenTool, label: 'Content Intel', agents: '26 Active Agents' },
];

const bottomItems = [
  { id: 'reports', icon: FileText, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'alerts', icon: AlertTriangle, label: 'Alerts', hasNotification: true },
];

function NavItem({ item, isActive, onClick, bp }) {
  const Icon = item.icon;
  const isAlerts = item.id === 'alerts';
  const isMobile = bp === 'mobile';
  const hideText = bp === 'mobile' || bp === 'tablet';

  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? 0 : 4,
        padding: '12px 0',
        width: isMobile ? 'auto' : '100%',
        position: 'relative',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
      }}
    >
      {/* Active indicator bar */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          style={isMobile ? {
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 20,
            height: 2,
            background: colors.cyan,
            borderRadius: 1,
            boxShadow: '0 0 8px rgba(0,240,255,0.4)',
          } : {
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 2,
            height: 32,
            background: colors.cyan,
            borderRadius: 1,
            boxShadow: '0 0 8px rgba(0,240,255,0.4)',
          }}
        />
      )}

      {/* Icon container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        style={{ position: 'relative' }}
      >
        <Icon
          size={22}
          color={isActive ? colors.cyan : isAlerts ? colors.orange : colors.textSecondary}
          style={{
            filter: isActive
              ? 'drop-shadow(0 0 8px rgba(0,240,255,0.6))'
              : isAlerts
                ? `drop-shadow(0 0 6px ${colors.orangeGlow})`
                : 'none',
            transition: 'color 0.2s ease, filter 0.2s ease',
          }}
        />
        {/* Notification dot for alerts */}
        {item.hasNotification && (
          <div
            style={{
              position: 'absolute',
              top: -2,
              right: -4,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#FF4C4C',
              boxShadow: '0 0 6px rgba(255,76,76,0.5)',
            }}
          />
        )}
      </motion.div>

      {/* Label */}
      {!hideText && (
        <span
          style={{
            fontSize: 9,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: isActive ? colors.cyan : colors.textMuted,
            transition: 'color 0.2s ease',
            lineHeight: 1.2,
            textAlign: 'center',
            maxWidth: 64,
          }}
        >
          {item.label}
        </span>
      )}

      {/* Agent count */}
      {item.agents && !hideText && (
        <span
          style={{
            fontSize: 7,
            color: isActive ? colors.cyanGlow : colors.textMuted,
            fontWeight: 500,
            letterSpacing: '0.02em',
            opacity: 0.8,
          }}
        >
          {item.agents}
        </span>
      )}
    </button>
  );
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState('consumer');
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  // On mobile, only show the 4 main nav items + Alerts (hide Reports and Settings)
  const mobileBottomItems = bottomItems.filter((item) => item.id === 'alerts');

  const navWidth = isMobile ? '100%' : isTablet ? 60 : 80;

  return (
    <motion.nav
      initial={isMobile
        ? { x: 0, y: 56, opacity: 0 }
        : { x: isTablet ? -60 : -80, opacity: 0 }
      }
      animate={isMobile
        ? { x: 0, y: 0, opacity: 1 }
        : { x: 0, opacity: 1 }
      }
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      style={isMobile ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 56,
        width: '100%',
        background: '#080c10',
        borderTop: '1px solid rgba(0,240,255,0.1)',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 4px',
        overflow: 'hidden',
        flexShrink: 0,
        zIndex: 100,
      } : {
        width: navWidth,
        height: '100%',
        background: colors.bgPanel,
        borderRight: `1px solid ${colors.borderDefault}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 16,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Top nav group */}
      <div
        style={isMobile ? {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: '100%',
          gap: 0,
        } : {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          flex: 1,
        }}
      >
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={setActiveId}
            bp={bp}
          />
        ))}
        {/* On mobile, render alerts inline with main nav items */}
        {isMobile && mobileBottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={setActiveId}
            bp={bp}
          />
        ))}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 40,
          height: 1,
          background: colors.borderDefault,
          margin: '8px 0',
          flexShrink: 0,
          display: isMobile ? 'none' : 'block',
        }}
      />

      {/* Bottom nav group */}
      {!isMobile && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {bottomItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={setActiveId}
              bp={bp}
            />
          ))}
        </div>
      )}
    </motion.nav>
  );
}
