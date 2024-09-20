# 使用Node.js作为基础镜像
FROM node:18-alpine as build

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 使用nginx作为生产环境的web服务器
FROM nginx:alpine

# 复制构建产物到nginx服务目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制nginx配置文件（如果有自定义配置的话）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 3000

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
