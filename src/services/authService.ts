import { User, LoginCredentials } from '../types';

const USERS_KEY = 'app_users';
const TOKEN_KEY = 'auth_token';
const SESSION_KEY = 'user_session';

// Dados iniciais de usuários
const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    nivel: 'admin',
    nome: 'Administrador',
    email: 'admin@sistema.com',
    telefone: '(11) 99999-9999',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    username: 'user',
    nivel: 'user',
    nome: 'Usuário Comum',
    email: 'user@sistema.com',
    telefone: '(11) 88888-8888',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    username: 'gerente',
    nivel: 'gerente',
    nome: 'Gerente Sistema',
    email: 'gerente@sistema.com',
    telefone: '(11) 77777-7777',
    createdAt: new Date().toISOString()
  }
];

// Passwords para cada usuário (normalmente seriam hasheadas)
const userPasswords: Record<string, string> = {
  'admin': 'admin123',
  'user': 'user123',
  'gerente': 'gerente123'
};

// Simulação de JWT Token
interface TokenPayload {
  userId: string;
  username: string;
  nivel: string;
  iat: number;
  exp: number;
}

class AuthService {
  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    const existingUsers = localStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Simula criação de token JWT
  private createToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      nivel: user.nivel,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    };

    // Simula um token JWT (na verdade é só base64 do payload)
    const token = btoa(JSON.stringify(payload));
    return `mock.${token}.signature`;
  }

  // Simula verificação de token JWT
  private verifyToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      
      // Verifica se o token expirou
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; token?: string; user?: User }> {
    const { username, password, nivel } = credentials;
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = this.getUsers();
    const user = users.find(u => 
      u.username === username && 
      u.nivel === nivel &&
      userPasswords[username] === password
    );

    if (user) {
      const token = this.createToken(user);
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return { success: true, token, user };
    }

    return { success: false };
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const sessionData = localStorage.getItem(SESSION_KEY);
    
    if (!token || !sessionData) return null;

    try {
      const payload = this.verifyToken(token);
      if (!payload) {
        this.logout();
        return null;
      }

      const user = JSON.parse(sessionData);
      return user;
    } catch {
      this.logout();
      return null;
    }
  }

  updateUser(userId: string, userData: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...userData };
      this.saveUsers(users);
      
      // Atualiza também os dados da sessão
      const currentSession = localStorage.getItem(SESSION_KEY);
      if (currentSession) {
        const sessionUser = JSON.parse(currentSession);
        if (sessionUser.id === userId) {
          localStorage.setItem(SESSION_KEY, JSON.stringify(users[userIndex]));
        }
      }
      
      return users[userIndex];
    }
    
    return null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    const payload = this.verifyToken(token);
    if (!payload) {
      this.logout();
      return false;
    }

    return true;
  }

  // CRUD Methods for User Management
  
  getAllUsers(): User[] {
    return this.getUsers();
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    
    // Verifica se o username já existe
    const existingUser = users.find(u => u.username === userData.username);
    if (existingUser) {
      return { success: false, error: 'Nome de usuário já existe' };
    }

    // Verifica se o email já existe
    if (userData.email) {
      const existingEmail = users.find(u => u.email === userData.email);
      if (existingEmail) {
        return { success: false, error: 'E-mail já está em uso' };
      }
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Salva a senha do usuário
    userPasswords[userData.username] = password;

    return { success: true, user: newUser };
  }

  updateUserById(id: string, userData: Partial<User>): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Verifica se o novo username já existe (se está sendo alterado)
    if (userData.username && userData.username !== users[userIndex].username) {
      const existingUser = users.find(u => u.username === userData.username && u.id !== id);
      if (existingUser) {
        return { success: false, error: 'Nome de usuário já existe' };
      }
    }

    // Verifica se o novo email já existe (se está sendo alterado)
    if (userData.email && userData.email !== users[userIndex].email) {
      const existingEmail = users.find(u => u.email === userData.email && u.id !== id);
      if (existingEmail) {
        return { success: false, error: 'E-mail já está em uso' };
      }
    }

    const updatedUser = { ...users[userIndex], ...userData };
    users[userIndex] = updatedUser;
    this.saveUsers(users);

    // Atualiza também os dados da sessão se for o usuário logado
    const currentSession = localStorage.getItem(SESSION_KEY);
    if (currentSession) {
      const sessionUser = JSON.parse(currentSession);
      if (sessionUser.id === id) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      }
    }

    return { success: true, user: updatedUser };
  }

  deleteUser(id: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    // Não permite deletar o próprio usuário logado
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      return { success: false, error: 'Não é possível deletar seu próprio usuário' };
    }

    // Remove a senha do usuário também
    const userToDelete = users[userIndex];
    delete userPasswords[userToDelete.username];

    users.splice(userIndex, 1);
    this.saveUsers(users);

    return { success: true };
  }

  updateUserPassword(username: string, newPassword: string): { success: boolean; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    userPasswords[username] = newPassword;
    return { success: true };
  }

  // Método adicional para obter estatísticas do sistema
  getSystemStats() {
    const users = this.getUsers();
    return {
      totalUsers: users.length,
      adminUsers: users.filter(u => u.nivel === 'admin').length,
      managerUsers: users.filter(u => u.nivel === 'gerente').length,
      regularUsers: users.filter(u => u.nivel === 'user').length
    };
  }
}

export const authService = new AuthService();
