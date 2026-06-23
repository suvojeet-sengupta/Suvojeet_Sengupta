FROM node:22-slim

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

COPY . .

# Expose port
EXPOSE 5003

ENV PORT=5003
ENV NODE_ENV=production

CMD ["npm", "start"]
