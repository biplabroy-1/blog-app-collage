# ---- Build Stage ----
FROM oven/bun:slim AS builder

WORKDIR /app

COPY . .

RUN bun install && bun run build

# ---- Production Stage ----
FROM nginx:alpine AS production

# Copy entire dist folder contents (not just top-level files)
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
