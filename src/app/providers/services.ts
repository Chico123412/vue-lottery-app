import { ServiceProvider } from "@/shared/api";
import { UserService } from "@/entities/user";
export function registerServices() {
  ServiceProvider.register("users", () => new UserService());
}
