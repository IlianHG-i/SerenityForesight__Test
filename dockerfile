FROM node
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npx", "nodemon", "--legacy-watch", "--ignore", "openapi.json", "server.js"]