import { request } from "@/shared/api";
import type { Creatable, Deletable, Editable, Readable } from "@/shared/api";
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
  UsersResponse,
} from "../model/types";
export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable<User>
{
  getAll(limit = 10, skip = 0, query = ""): Promise<UsersResponse> {
    return request(
      query
        ? `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
        : `/users?limit=${limit}&skip=${skip}`,
    );
  }
  getById(id: number) {
    return request<User>(`/users/${id}`);
  }
  create(data: CreateUserDto) {
    return request<User>("/users/add", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
  update(id: number, data: UpdateUserDto) {
    return request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
  delete(id: number) {
    return request<User>(`/users/${id}`, { method: "DELETE" });
  }
}
