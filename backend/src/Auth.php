<?php

namespace App;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Auth {
    public static function generateToken(array $payload): string {
        $issuedAt = time();
        $expire = $issuedAt + (60 * 60 * 24 * 7); // 7 days

        $token = [
            'iat' => $issuedAt,
            'exp' => $expire,
            'user_id' => $payload['user_id'],
            'email' => $payload['email']
        ];

        return JWT::encode($token, JWT_SECRET, JWT_ALGORITHM);
    }

    public static function validateToken(string $token): ?array {
        try {
            $decoded = JWT::decode($token, new Key(JWT_SECRET, JWT_ALGORITHM));
            return (array) $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function getBearerToken(): ?string {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return $matches[1];
        }
        
        return null;
    }

    public static function getUserFromToken(): ?array {
        $token = self::getBearerToken();
        if (!$token) {
            return null;
        }
        return self::validateToken($token);
    }

    public static function hashPassword(string $password): string {
        return password_hash($password, PASSWORD_BCRYPT);
    }

    public static function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}

