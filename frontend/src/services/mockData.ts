import type { Post, User } from '@/types/blog';

// Mock data for demonstration (remove when connecting to real backend)
export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  isAdmin: false,
  bio: 'Full-stack developer passionate about React, TypeScript, and modern web technologies. Love building clean, efficient applications.',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  joined_at: '2023-06-15T10:00:00Z',
};

export const mockAdminUser: User = {
  id: '2',
  email: 'admin@example.com',
  name: 'Admin User',
  isAdmin: true,
  bio: 'Platform administrator and senior developer. Helping the community grow and sharing knowledge about backend development.',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  location: 'New York, NY',
  website: 'https://admin-blog.dev',
  joined_at: '2023-01-10T08:30:00Z',
};

export const mockUsers: User[] = [mockUser, mockAdminUser];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    body: `React and TypeScript together provide a powerful combination for building robust web applications. TypeScript adds static typing to React, catching errors early in development and improving code maintainability.

In this comprehensive guide, we'll explore the fundamentals of using React with TypeScript, including component typing, props interfaces, and best practices for type-safe development.

## Why TypeScript with React?

TypeScript brings several advantages to React development:
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Improved autocomplete and intellisense
- **Self-Documenting Code**: Types serve as inline documentation
- **Refactoring Confidence**: Make changes with confidence

## Setting Up Your Project

The easiest way to start is with Create React App or Vite with the TypeScript template...`,
    author_id: '1',
    author_name: 'John Doe',
    created_at: '2024-01-15T10:30:00Z',
    excerpt: 'Learn how to combine React and TypeScript for building type-safe, maintainable applications.',
  },
  {
    id: '2',
    title: 'Building RESTful APIs with PHP',
    body: `PHP remains a popular choice for building backend APIs. In this tutorial, we'll create a modern RESTful API using PHP best practices, including proper error handling, validation, and security measures.

## Project Structure

A well-organized project structure is crucial for maintainability. Here's what we recommend:

\`\`\`
/api
  /auth
    login.php
    signup.php
  /posts
    index.php
    create.php
    update.php
    delete.php
/config
  database.php
/middleware
  auth.php
\`\`\`

## Database Design

We'll use MySQL with prepared statements to prevent SQL injection...`,
    author_id: '2',
    author_name: 'Admin User',
    created_at: '2024-01-14T14:20:00Z',
    excerpt: 'A comprehensive guide to building secure and scalable RESTful APIs using PHP and MySQL.',
  },
  {
    id: '3',
    title: 'JWT Authentication Explained',
    body: `JSON Web Tokens (JWT) have become the standard for API authentication. This article breaks down how JWT works and how to implement it securely in your applications.

## What is JWT?

JWT is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object.

### JWT Structure

A JWT consists of three parts separated by dots:
- **Header**: Token type and hashing algorithm
- **Payload**: Claims and data
- **Signature**: Verification hash

## Security Best Practices

When implementing JWT authentication:
1. Use HTTPS only
2. Set appropriate expiration times
3. Store tokens securely
4. Implement refresh token rotation
5. Validate tokens on every request...`,
    author_id: '1',
    author_name: 'John Doe',
    created_at: '2024-01-13T09:15:00Z',
    excerpt: 'Understanding JWT authentication and implementing it securely in your web applications.',
  },
  {
    id: '4',
    title: 'Modern CSS Techniques',
    body: `CSS has evolved significantly in recent years. Let's explore modern CSS features that make styling more powerful and maintainable.

## CSS Grid and Flexbox

The combination of CSS Grid and Flexbox gives us unprecedented control over layouts. Grid excels at two-dimensional layouts, while Flexbox handles one-dimensional arrangements beautifully.

## CSS Custom Properties

CSS variables (custom properties) enable dynamic styling and theming:

\`\`\`css
:root {
  --primary-color: #2c7a7b;
  --spacing-unit: 1rem;
}
\`\`\`

## Container Queries

The newest addition to CSS, container queries allow components to adapt based on their container's size rather than the viewport...`,
    author_id: '2',
    author_name: 'Admin User',
    created_at: '2024-01-12T16:45:00Z',
    excerpt: 'Explore the latest CSS features and techniques for creating beautiful, responsive designs.',
  },
];
