import { useState, useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';
const TABLET_QUERY = '(min-width: 768px) and (max-width: 1024px)';

function getBreakpoint(mobile, tablet) {
  if (mobile.matches) return 'mobile';
  if (tablet.matches) return 'tablet';
  return 'desktop';
}

export default function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getBreakpoint(
      window.matchMedia(MOBILE_QUERY),
      window.matchMedia(TABLET_QUERY)
    );
  });

  useEffect(() => {
    const mobileList = window.matchMedia(MOBILE_QUERY);
    const tabletList = window.matchMedia(TABLET_QUERY);

    const handler = () => setBp(getBreakpoint(mobileList, tabletList));

    mobileList.addEventListener('change', handler);
    tabletList.addEventListener('change', handler);
    return () => {
      mobileList.removeEventListener('change', handler);
      tabletList.removeEventListener('change', handler);
    };
  }, []);

  return bp;
}
