import { getAdapter } from "./adapter/manager";
import type { User } from "./models";
  
  export const login = async (user: Partial<User> & { deviceName?: string }) => {
    return getAdapter().auth.login(user);
  };
  
  export const register = (user: Partial<User> & { deviceName?: string }) => {
    return getAdapter().auth.register(user);
  };
  
  export const check = () => {
    return getAdapter().auth.check();
  };
  
  export const hello = () => {
    return getAdapter().auth.hello();
  };