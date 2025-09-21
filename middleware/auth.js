export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('auth-token')
  
  if (!token.value) {
    return navigateTo('/login')
  }
  
  // Optional: You can add token validation here
  // by making a quick API call to verify the token is still valid
})