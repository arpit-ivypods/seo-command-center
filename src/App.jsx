import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import useBreakpoint from './hooks/useBreakpoint';

const ConsumerIntel = lazy(() => import('./components/widgets/ConsumerIntel'));
const MarketIntel = lazy(() => import('./components/widgets/MarketIntel'));
const CompetitorIntel = lazy(() => import('./components/widgets/CompetitorIntel'));
const ContentIntel = lazy(() => import('./components/widgets/ContentIntel'));
const AgentNetwork = lazy(() => import('./components/widgets/AgentNetwork'));
const NotificationsActions = lazy(() => import('./components/widgets/NotificationsActions'));
const OverviewAnalytics = lazy(() => import('./components/widgets/OverviewAnalytics'));

function WidgetFallback() {
  return (
    <div
      style={{
        background: 'rgba(17, 24, 34, 0.85)',
        border: '1px solid rgba(0, 240, 255, 0.15)',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#556677',
        fontSize: 12,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      Loading...
    </div>
  );
}

export default function App() {
  const bp = useBreakpoint();

  return (
    <div
      style={{
        width: '100vw',
        height: bp === 'mobile' ? 'auto' : '100vh',
        minHeight: bp === 'mobile' ? '100vh' : undefined,
        display: 'grid',
        gridTemplateColumns:
          bp === 'mobile' ? '1fr' :
          bp === 'tablet' ? '60px 1fr' :
          '80px 1fr',
        background: '#080c10',
        overflow: bp === 'mobile' ? 'visible' : 'hidden',
      }}
    >
      <Sidebar />

      <div
        style={{
          display: 'grid',
          gridTemplateRows: '52px 1fr',
          overflow: bp === 'desktop' ? 'hidden' : 'visible',
          minHeight: 0,
        }}
      >
        <Header />

        <AnimatePresence mode="wait">
          <div
            className="dashboard-grid"
            style={bp === 'desktop' ? {
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 0.9fr)',
              gap: 14,
              padding: 14,
              overflow: 'hidden',
              minHeight: 0,
            } : {
              display: 'grid',
              overflow: 'visible',
              height: 'auto',
              minHeight: 0,
            }}
          >
            {/* Consumer Intel — spans rows 1+2, column 1 (tall) */}
            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '1 / 2', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '1 / 2', gridRow: '1 / 3', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <ConsumerIntel delay={0.5} />
              </div>
            </Suspense>

            {/* Row 1: Market, Competitor, Content (columns 2-4) */}
            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '2 / 3', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '2 / 3', gridRow: '1 / 2', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <MarketIntel delay={0.6} />
              </div>
            </Suspense>

            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '1 / 2', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '3 / 4', gridRow: '1 / 2', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <CompetitorIntel delay={0.7} />
              </div>
            </Suspense>

            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '2 / 3', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '4 / 5', gridRow: '1 / 2', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <ContentIntel delay={0.8} />
              </div>
            </Suspense>

            {/* Row 2: Agent Network (cols 2-3) + Notifications (col 4) */}
            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '1 / 3', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '2 / 4', gridRow: '2 / 3', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <AgentNetwork delay={0.9} />
              </div>
            </Suspense>

            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '1 / 3', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '4 / 5', gridRow: '2 / 3', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <NotificationsActions delay={0.9} />
              </div>
            </Suspense>

            {/* Row 3: Overview Analytics (full width) */}
            <Suspense fallback={<WidgetFallback />}>
              <div style={
                bp === 'mobile' ? { height: 'auto', minHeight: 'auto', overflow: 'hidden' } :
                bp === 'tablet' ? { gridColumn: '1 / 3', minHeight: 0, overflow: 'hidden', height: '100%' } :
                { gridColumn: '1 / 5', gridRow: '3 / 4', minHeight: 0, overflow: 'hidden', height: '100%' }
              }>
                <OverviewAnalytics delay={1.2} />
              </div>
            </Suspense>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
