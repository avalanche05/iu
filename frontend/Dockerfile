FROM node:18-alpine

WORKDIR /app

COPY . /app

COPY .env /app/.env

RUN npm install -g pnpm --global-dir=/usr/local/lib/pnpm

RUN pnpm install

RUN pnpm run build

RUN npm add serve -g

EXPOSE 3000

CMD ["npm", "run", "serve"]