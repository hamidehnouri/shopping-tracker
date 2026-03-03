FROM node:24-alpine

WORKDIR /app

COPY apps/backend/package.json apps/backend/package-lock.json ./apps/backend/

WORKDIR /app/apps/backend
RUN npm ci

COPY apps/backend ./

EXPOSE 4000
CMD ["npm", "run", "dev"]