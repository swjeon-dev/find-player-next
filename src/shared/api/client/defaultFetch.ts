import { rtdbRequest } from '../rtdbRequest'

const defaultClientFetch = async <T>(
  path: string,
  errorMessage?: string,
): Promise<T> => {
  return rtdbRequest<T>(path, { cache: 'no-store' }, errorMessage)
}

export default defaultClientFetch
