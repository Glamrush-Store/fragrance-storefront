export default defineNuxtRouteMiddleware(async (to) => {
  const { user, ensureSession } = useAuth()

  await ensureSession()
  if (!user.value) {
    return navigateTo({ path: '/auth/sign-in', query: { redirect: to.fullPath } })
  }
})
