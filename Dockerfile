FROM node:20 AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ls -la /app || echo "/app not found"
RUN ls -la /app/src || echo "/app/src not found"
RUN ls -la /app/src/pages || echo "/app/src/pages not found"
RUN ls -la /app/src/pages/authenticate || echo "/app/src/pages/authenticate not found"
RUN npm run build

FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]