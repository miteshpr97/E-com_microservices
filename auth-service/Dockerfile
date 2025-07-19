FROM node:20

WORKDIR /app

COPY package*.json ./

# ✅ Include dev dependencies for TypeScript
RUN npm install --include=dev

COPY . .

# ✅ Compile TypeScript code
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
