import type { Post, CreatePostData, UpdatePostData, AuthResponse, User, UpdateProfileData } from '@/types/blog';

// Configure your PHP backend URL here
const API_BASE_URL = 'http://localhost:8000/api'; // Update this to your PHP backend URL

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Login failed');
    }
    
    const { token, user } = result.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }
    
    const { token, user } = result.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { token, user };
  },

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): any | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};

// Posts API
export const postsApi = {
  async getAll(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
    });
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch posts');
    }
    
    return result.data;
  },

  async getById(id: string): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    });
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch post');
    }
    
    return result.data;
  },

  async create(data: CreatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to create post');
    }
    
    return result.data;
  },

  async update(id: string, data: UpdatePostData): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update post');
    }
    
    return result.data;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete post');
    }
  },
};

// Profiles API
export const profilesApi = {
  async getById(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch user profile');
    }
    
    return result.data;
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/posts`, {
      headers: getAuthHeaders(),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch user posts');
    }
    
    return result.data;
  },

  async update(userId: string, data: UpdateProfileData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to update profile');
    }
    
    const updatedUser = result.data;
    // Update local storage if updating current user
    const currentUser = authApi.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return updatedUser;
  },
};
