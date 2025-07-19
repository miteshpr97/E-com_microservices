FROM node:20

WORKDIR /app

COPY package*.json ./

# ✅ Include dev dependencies (like TypeScript)
RUN npm install --include=dev

COPY . .

# ✅ Compile TypeScript code
RUN npm run build

EXPOSE 5002

CMD ["npm", "start"]
