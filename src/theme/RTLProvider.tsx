import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

interface RTLProviderProps {
  children: React.ReactNode;
}

export function RTLProvider({ children }: RTLProviderProps) {
  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}