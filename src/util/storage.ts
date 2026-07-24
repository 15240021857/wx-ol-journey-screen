interface StorageType {
  set: (key: string, value: any) => void
  get: (key: string) => any
  remove: (key: string) => void
  clear: () => void
}

interface StorageTool {
  local: StorageType
  session: StorageType
}

export const storage: StorageTool = {
  local: {
    set: (key: string, value: any) => {
      const val = typeof value === 'object' ? JSON.stringify(value) : value
      localStorage.setItem(key, val)
    },
    get: (key: string) => {
      const val = localStorage.getItem(key)
      try {
        return JSON.parse(val!)
      } catch (error) {
        return val
      }
    },
    remove: (key: string) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
  },
  session: {
    set: (key: string, value: any) => {
      const val = typeof value === 'object' ? JSON.stringify(value) : value
      sessionStorage.setItem(key, val)
    },
    get: (key: string) => {
      const val = sessionStorage.getItem(key)
      try {
        return JSON.parse(val!)
      } catch (error) {
        return val
      }
    },
    remove: (key: string) => sessionStorage.removeItem(key),
    clear: () => sessionStorage.clear()
  }
}
