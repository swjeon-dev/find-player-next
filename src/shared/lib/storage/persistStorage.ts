const noopStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
}

export const sessionPersistStorage =
  typeof window !== 'undefined' ? window.sessionStorage : noopStorage
