export default function session(storeName) {
  return {
    async setItem(key, val) {
      sessionStorage.setItem(storeName, JSON.stringify(val))
    },
    async getItem() {
      const val = sessionStorage.getItem(storeName)
      return val ? JSON.parse(val) : null
    },
    async removeItem() {
      sessionStorage.removeItem(storeName)
    }
  }
}