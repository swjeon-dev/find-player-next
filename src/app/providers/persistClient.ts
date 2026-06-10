import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

import { queryClient } from './queryClient'

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
})

export const setupQueryPersist = () => {
  persistQueryClient({
    queryClient,
    persister: localStoragePersister,
    maxAge: 1000 * 60 * 60 * 24,

    buster: 'v1', // 구조 변경 시 초기화

    dehydrateOptions: {
      shouldDehydrateQuery: query => {
        const key = query.queryKey

        // 특정 query만 persist
        return (
          query.state.status === 'success' &&
          Array.isArray(key) &&
          key[0] === 'persist'
        )
      },
    },
  })
}
