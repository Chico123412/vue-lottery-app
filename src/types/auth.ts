import type { User } from './user'

export interface LoginDto { username: string; password: string }
export interface AuthResponse extends User { accessToken: string; refreshToken: string }
export interface AuthSession { user: User; accessToken: string; refreshToken: string }
