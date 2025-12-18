FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm install --production

# Copy application source
COPY . .

EXPOSE 5000

# Default environment values can be overridden at runtime
ENV NODE_ENV=production

CMD ["npm", "start"]
