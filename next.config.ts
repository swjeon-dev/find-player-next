import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@/shared/lib/dev': path.join(
        __dirname,
        process.env.NODE_ENV === 'production'
          ? 'src/shared/lib/dev/index.prod.ts'
          : 'src/shared/lib/dev/index.ts',
      ),
    },
  },
}

export default nextConfig
