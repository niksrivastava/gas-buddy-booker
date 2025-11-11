export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
