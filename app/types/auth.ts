export interface AuthUser {
  id: string | number
  name: string
  email: string
  phone?: string | null
  created_at?: string | null
}

export interface AuthSession {
  user: AuthUser
}

export interface ValidationErrors {
  [field: string]: string[]
}

export interface ApiErrorBody {
  message?: string
  errors?: ValidationErrors
}
