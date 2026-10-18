import { request } from '@/api/http-client'
import type { Creatable, Deletable, Editable, Readable } from './interfaces'
import type { CreateUserDto, UpdateUserDto, User, UsersResponse } from '@/types/user'

export class UserService implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable<User> {
  getAll(limit = 10, skip = 0, query = ''): Promise<UsersResponse> {
    const path = query ? `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}` : `/users?limit=${limit}&skip=${skip}`
    return request(path)
  }
  getById(id: number) { return request<User>(`/users/${id}`) }
  create(data: CreateUserDto) { return request<User>('/users/add', { method: 'POST', body: JSON.stringify(data) }) }
  update(id: number, data: UpdateUserDto) { return request<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
  delete(id: number) { return request<User>(`/users/${id}`, { method: 'DELETE' }) }
}
