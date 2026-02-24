FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV DATABASE_URL=mysql://placeholder:placeholder@placeholder:3306/placeholder
ENV JWT_SECRET=placeholder
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]