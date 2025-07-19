FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# For development (hot reload)
CMD ["npm", "run", "dev"]

# For production, use:
# RUN npm run build
# CMD ["npm", "start"]
