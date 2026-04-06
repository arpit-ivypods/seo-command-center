import { motion } from 'framer-motion';
import { Atom } from 'lucide-react';
import { colors, fonts } from '../../theme';
import useBreakpoint from '../../hooks/useBreakpoint';

export default function Header() {
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const isTablet = bp === 'tablet';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' }}
      style={{
        height: isMobile ? 44 : isTablet ? 48 : 52,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 20px',
        borderBottom: '1px solid rgba(0, 240, 255, 0.1)',
        flexShrink: 0,
      }}
    >
      {/* Left: Logo + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Atom
          size={isMobile ? 18 : 24}
          color={colors.cyan}
          style={{
            filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.6))',
          }}
        />
        <span
          style={{
            fontFamily: fonts.primary,
            fontWeight: 800,
            fontSize: isMobile ? 11 : isTablet ? 13 : 16,
            color: colors.cyan,
            letterSpacing: isMobile ? '0.1em' : '0.2em',
            textTransform: 'uppercase',
            textShadow: '0 0 20px rgba(0,240,255,0.5), 0 0 40px rgba(0,240,255,0.2)',
            userSelect: 'none',
          }}
        >
          INTELLIGENT SEO COMMAND CENTER
        </span>
      </div>

      {/* Right: System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* "SYSTEM STATUS:" hidden on mobile and tablet */}
        {!isMobile && !isTablet && (
          <span
            style={{
              fontFamily: fonts.primary,
              fontWeight: 500,
              fontSize: 12,
              color: colors.textSecondary,
            }}
          >
            SYSTEM STATUS:
          </span>
        )}
        {/* "OPERATIONAL" hidden on mobile, visible on tablet and desktop */}
        {!isMobile && (
          <span
            style={{
              fontFamily: fonts.primary,
              fontWeight: 700,
              fontSize: 12,
              color: colors.textPrimary,
            }}
          >
            OPERATIONAL
          </span>
        )}
        <div
          style={{
            width: isMobile ? 8 : 10,
            height: isMobile ? 8 : 10,
            borderRadius: '50%',
            background: colors.green,
            boxShadow: '0 0 12px rgba(40,199,111,0.7)',
            animation: 'pulse-green 2s ease-in-out infinite',
          }}
        />
      </div>
    </motion.header>
  );
}
