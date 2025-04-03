FROM node:20 AS build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN ls -la /app  # 전체 디렉토리 확인
RUN ls -la /app/src  # src 디렉토리 확인
RUN ls -la /app/src/pages  # pages 디렉토리 확인
RUN ls -la /app/src/pages/authenticate  # authenticate 디렉토리 확인
RUN npm run build

FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/mime.types /etc/nginx/mime.types
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]