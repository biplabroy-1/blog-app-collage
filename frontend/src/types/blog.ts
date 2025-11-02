export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
  joined_at?: string;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  author_id: string;
  author_name: string;
  created_at: string;
  excerpt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  body: string;
}

export interface UpdatePostData {
  title?: string;
  body?: string;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  website?: string;
}
