export interface User {
  id: string;
  username: string;
  nivel: 'admin' | 'user' | 'gerente';
  nome?: string;
  email?: string;
  telefone?: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  nivel: 'admin' | 'user' | 'gerente';
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}
