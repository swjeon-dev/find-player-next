export interface DefaultServerFetchOptions {
  revalidate?: number | false
  tags?: string[]
}

export type RtdbRequestInit = RequestInit & {
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}
