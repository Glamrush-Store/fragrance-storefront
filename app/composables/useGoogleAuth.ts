interface GoogleTokenResponse {
  access_token?: string
  error?: string
  error_description?: string
}

interface GoogleTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (options: {
            client_id: string
            scope: string
            callback: (response: GoogleTokenResponse) => void
            error_callback?: (error: { type?: string }) => void
          }) => GoogleTokenClient
        }
      }
    }
  }
}

let scriptPromise: Promise<void> | null = null

const loadGoogleIdentityServices = () => {
  if (!import.meta.client || window.google) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity-services]')
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Unable to load Google sign-in.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentityServices = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Unable to load Google sign-in.'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export const useGoogleAuth = () => {
  const config = useRuntimeConfig()
  const clientId = computed(() => String(config.public.googleClientId || ''))

  const requestAccessToken = async () => {
    if (!clientId.value) throw new Error('Google sign-in is not configured.')
    await loadGoogleIdentityServices()

    return await new Promise<string>((resolve, reject) => {
      const oauth = window.google?.accounts.oauth2
      if (!oauth) {
        reject(new Error('Google sign-in is unavailable.'))
        return
      }

      const client = oauth.initTokenClient({
        client_id: clientId.value,
        scope: 'openid email profile',
        callback: (response) => {
          if (response.access_token) resolve(response.access_token)
          else reject(new Error(response.error_description || 'Google sign-in was not completed.'))
        },
        error_callback: () => reject(new Error('Google sign-in was cancelled.')),
      })
      client.requestAccessToken({ prompt: 'select_account' })
    })
  }

  return { clientId, requestAccessToken }
}
