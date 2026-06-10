import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import styled from 'styled-components'

import ProtectedRoute from './ProtectedRoute'
import { RootLayout, ROUTER_PATH, SkeletonBase } from '@/shared'
import { Cover } from '@/pages/cover'
import { NotFound } from '@/pages/not-found'

const Submission = lazy(() =>
  import('@/pages/submission').then(m => ({ default: m.Submission })),
)

const RouteFallback = styled(SkeletonBase)`
  width: 100%;
  min-height: 240px;
  border-radius: 12px;
  margin: 24px 0;
`

const routes = [
  {
    path: ROUTER_PATH.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Cover />,
      },
      {
        path: ROUTER_PATH.SUBMISSION,
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense
                fallback={<RouteFallback aria-label='퀴즈 화면 로딩' />}
              >
                <Submission />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

const router = createBrowserRouter(routes, {
  basename,
})

export default router
