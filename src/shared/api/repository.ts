export interface Readable<T> {
  getAll(
    limit?: number,
    skip?: number,
    query?: string,
  ): Promise<{ users: T[]; total: number; skip: number; limit: number }>;
  getById(id: number): Promise<T>;
}
export interface Creatable<T, D> {
  create(data: D): Promise<T>;
}
export interface Editable<T, D> {
  update(id: number, data: D): Promise<T>;
}
export interface Deletable<T> {
  delete(id: number): Promise<T>;
}
