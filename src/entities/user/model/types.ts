export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age: number;
  gender: string;
  phone: string;
  image?: string;
}
export interface CreateUserDto extends Omit<User, "id" | "image"> {
  password: string;
}
export type UpdateUserDto = Partial<CreateUserDto>;
export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
