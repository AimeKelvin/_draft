import { UserRole } from './types';

export interface AuthToken {
  userId: string;
  fullName: string;
  role: UserRole;
  iat: number;
  exp: number;
}

const TOKEN_KEY = 'resto_auth_token';

// Mock credentials mapping for simulation
// In a real app, this would be handled by the backend
const MOCK_USERS = {
  manager: {
    username: 'manager',
    password: 'manager123',
    userId: 'u1',
    fullName: 'Sarah Chen',
    role: 'manager' as UserRole
  },
  waiter: {
    username: 'waiter',
    password: 'waiter123',
    userId: 'u2',
    fullName: 'James Wilson',
    role: 'waiter' as UserRole
  },
  kitchen: {
    username: 'kitchen',
    password: 'kitchen123',
    userId: 'u4',
    fullName: 'Alex Kim',
    role: 'kitchen' as UserRole
  }
};

export const authService = {
  /**
   * Simulates a backend login request that returns a JWT
   */
  async login(username: string, password: string): Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user = Object.values(MOCK_USERS).find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Create mock JWT token payload
    const payload: AuthToken = {
      userId: user.userId,
      fullName: user.fullName,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 8 * 60 * 60 * 1000 // 8 hours expiration
    };

    // Mock JWT encoding (base64 of payload)
    // Real JWT would have header.payload.signature
    const token = btoa(JSON.stringify(payload));
    this.setStoredToken(token);

    return token;
  },

  /**
   * Simulates a backend registration request for a manager
   */
  async register(
  fullName: string,
  username: string,
  password: string)
  : Promise<string> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate checking if user exists
    if (Object.values(MOCK_USERS).some((u) => u.username === username)) {
      throw new Error('Username already exists');
    }

    // Create mock JWT token payload for new manager
    const payload: AuthToken = {
      userId: 'u' + Math.floor(Math.random() * 10000),
      fullName,
      role: 'manager',
      iat: Date.now(),
      exp: Date.now() + 8 * 60 * 60 * 1000 // 8 hours expiration
    };

    const token = btoa(JSON.stringify(payload));
    this.setStoredToken(token);

    return token;
  },

  parseToken(token: string): AuthToken | null {
    try {
      return JSON.parse(atob(token));
    } catch {
      return null;
    }
  },

  isTokenValid(token: string): boolean {
    const payload = this.parseToken(token);
    if (!payload) return false;
    return payload.exp > Date.now();
  },

  getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setStoredToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearStoredToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
};