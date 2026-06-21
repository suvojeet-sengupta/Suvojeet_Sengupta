FROM node:22-slim

WORKDIR /app

COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

COPY . .

# Expose port
EXPOSE 5002

ENV PORT=5002
ENV NODE_ENV=production

CMD ["npm", "start"]
