export default defineNuxtPlugin(() => {
  const token = useCookie('auth-token')
  
  // Add token to all requests
  const { $fetch } = useNuxtApp()
  $fetch.defaults.headers = {
    ...($fetch.defaults.headers || {}),
    Authorization: token.value ? `Bearer ${token.value}` : ''
  }
})