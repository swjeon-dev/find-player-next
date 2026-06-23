import type { DefaultServerFetchOptions, RtdbRequestInit } from '../fetch.type'
import { rtdbRequest } from '../rtdbRequest'

function buildServerFetchInit(
  options?: DefaultServerFetchOptions,
): Pick<RtdbRequestInit, 'next'> {
  const next: NonNullable<RtdbRequestInit['next']> = {
    revalidate: options?.revalidate ?? 0,
  }

  if (options?.tags?.length) {
    next.tags = options.tags
  }

  return { next }
}

const defaultServerFetch = async <T>(
  path: string,
  options?: DefaultServerFetchOptions,
  errorMessage?: string,
): Promise<T> => {
  return rtdbRequest<T>(path, buildServerFetchInit(options), errorMessage)
}

export default defaultServerFetch
