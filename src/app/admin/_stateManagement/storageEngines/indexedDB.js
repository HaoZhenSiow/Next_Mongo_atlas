import Idbkv from 'idb-kv'

export default function indexedDB(storeName) {
  let store = new Idbkv(storeName)
  return {
    async getItem(key) {
      const data = await store.get(key)
      return data || null
    },
    async setItem(key, value) {
      store.set(key, value)
    },
    async removeItem(key) {
      store.delete(key)
    }
  }
}