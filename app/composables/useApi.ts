import type { ApiResponse } from '~/types/catalog'

type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface ApiRequestOptions {
  method?: ApiMethod
  query?: Record<string, unknown>
  body?: Record<string, unknown>
  headers?: Record<string, string>
}

const readBrowserCookie = (name: string): string | null => {
  if (!import.meta.client) return null

  const prefix = `${encodeURIComponent(name)}=`
  const cookie = document.cookie.split('; ').find(value => value.startsWith(prefix))

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseUrl = String(config.public.apiBase).replace(/\/$/, '')
  const backendUrl = String(config.public.backendUrl).replace(/\/$/, '')
  const serverCookie = import.meta.server ? useRequestHeader('cookie') : undefined

  const ensureCsrfCookie = async (force = false) => {
    if (!import.meta.client || (!force && readBrowserCookie('XSRF-TOKEN'))) return

    await $fetch(`${backendUrl}/sanctum/csrf-cookie`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
  }

  const request = async <T>(path: string, options: ApiRequestOptions = {}) => {
    const method = options.method ?? 'GET'
    const headers: Record<string, string> = { Accept: 'application/json', ...options.headers }

    if (options.body) headers['Content-Type'] = 'application/json'

    if (import.meta.server && serverCookie) {
      headers.Cookie = serverCookie
    }

    if (method !== 'GET') {
      await ensureCsrfCookie()
      const csrfToken = readBrowserCookie('XSRF-TOKEN')
      if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken
    }

    const execute = () => $fetch<T>(`${baseUrl}${path}`, {
      method,
      query: options.query,
      body: options.body,
      headers,
      credentials: 'include',
    })

    try {
      return await execute()
    }
    catch (error) {
      const status = (error as { status?: number; statusCode?: number }).status
        ?? (error as { status?: number; statusCode?: number }).statusCode

      if (method === 'GET' || status !== 419 || !import.meta.client) throw error

      await ensureCsrfCookie(true)
      const csrfToken = readBrowserCookie('XSRF-TOKEN')
      if (csrfToken) headers['X-XSRF-TOKEN'] = csrfToken

      return execute()
    }
  }

  const get = <T>(path: string, query?: Record<string, unknown>) => request<ApiResponse<T>>(path, { query })
  const post = <T>(path: string, body?: Record<string, unknown>) => request<ApiResponse<T>>(path, { method: 'POST', body })

  return { get, post, request, ensureCsrfCookie }
}
