import { request } from '@/api/http-client'
import type { AuthResponse, LoginDto } from '@/types/auth'
import type { User } from '@/types/user'

export class AuthService {
  login(data: LoginDto) { return request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ ...data, expiresInMins: 30 }) }) }
  me() { return request<User>('/auth/me') }
}
