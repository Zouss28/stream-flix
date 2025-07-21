############################
# 1. Build Stage
############################
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy only package manager files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install all dependencies (including devDependencies for Tailwind/PostCSS)
RUN pnpm install

# Copy the rest of the app
COPY . .

# Build the Next.js app (includes Tailwind/PostCSS processing)
RUN pnpm run build

############################
# 2. Production Stage
############################
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./ 
COPY --from=builder /app/.env* ./

# Set NODE_ENV to production
ENV NODE_ENV=production

# Railway sets PORT, but default to 3000 for local use
ENV PORT=3000

# Expose port 3000
EXPOSE 3000

# Start the Next.js production server
CMD ["pnpm", "start"]
