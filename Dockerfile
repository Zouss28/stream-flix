FROM node:20-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package manager and config files first for better caching
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.json ./
COPY next.config.* ./
COPY tailwind.config.* ./
COPY postcss.config.* ./

# Copy the rest of the app source code and static assets
COPY public ./public
COPY app ./app
COPY components ./components
COPY styles ./styles
COPY lib ./lib
COPY hooks ./hooks
COPY routes ./routes
COPY server.js ./
COPY .env* ./

# Install all dependencies (including devDependencies for Tailwind/PostCSS)
RUN pnpm install

# Build the Next.js app (includes Tailwind/PostCSS processing)
RUN pnpm run build

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port 3000 for Railway
EXPOSE 3000

# Healthcheck (optional, recommended for Railway)


# Start your custom Express/Next.js server
CMD ["node", "server.js"]
