# Stage 1: Build Vite Frontend
FROM node:20-alpine AS build-client
WORKDIR /app/client

ARG VITE_BASE
ENV VITE_BASE=$VITE_BASE


COPY client/package*.json ./
RUN npm install
COPY client/ ./
# This creates the /app/client/dist folder
RUN npm run build

# Stage 2: Build Node Backend (TypeScript)
FROM node:20-alpine AS build-server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build

# Stage 3: Final Production Runner
FROM node:20-alpine
WORKDIR /app

# Copy compiled server code
COPY --from=build-server /app/server/dist ./dist
COPY --from=build-server /app/server/package*.json ./
# Only install production dependencies (saves space)
RUN npm install --only=production

# Copy the Vite static files into the server's directory
# We'll put them in a folder called 'public' inside our runner
COPY --from=build-client /app/client/dist ./public

EXPOSE 5000
CMD ["node", "dist/index.js"]