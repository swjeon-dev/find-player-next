import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@/shared/lib/dev': path.join(
        __dirname,
        'src/shared/lib/dev/index.prod.ts',
      ),
    },
  },
}

export default nextConfig
