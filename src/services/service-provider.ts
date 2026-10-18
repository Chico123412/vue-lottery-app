import { AuthService } from './auth.service'
import { UserService } from './user.service'

export const services = { users: new UserService(), auth: new AuthService() }
