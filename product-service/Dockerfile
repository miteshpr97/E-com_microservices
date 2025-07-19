FROM node:20

WORKDIR /app

COPY package*.json ./

# ✅ Install dependencies including typescript
RUN npm install --include=dev

COPY . .

# ✅ Compile TypeScript code
RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]
