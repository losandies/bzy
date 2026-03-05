import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

// Base Next.js config
const baseConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: process.env.NODE_ENV === 'production',
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
};

// Start with base config
// eslint-disable-next-line import/no-mutable-exports
let configWithPlugins: NextConfig = baseConfig;

// Conditionally enable bundle analyzer
if (process.env.ANALYZE === 'true') {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

// Conditionally enable Sentry configuration
if (!process.env.NEXT_PUBLIC_SENTRY_DISABLED) {
  configWithPlugins = withSentryConfig(configWithPlugins, {
    org: process.env.SENTRY_ORGANIZATION,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,

    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',

    webpack: {
      reactComponentAnnotation: { enabled: true },
      treeshake: { removeDebugLogging: true },
    },

    telemetry: false,
  });
}

export default configWithPlugins;
