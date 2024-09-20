# 使用Node.js作为基础镜像
FROM node:18-alpine as build

# 安装pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制pnpm相关文件
COPY pnpm-lock.yaml ./

# 安装依赖
RUN pnpm fetch

# 复制其他项目文件
COPY . .

# 安装项目依赖
RUN pnpm install --offline

# 构建应用
RUN pnpm run build

# 使用nginx作为生产环境的web服务器
FROM nginx:alpine

# 复制构建产物到nginx服务目录
COPY --from=build /app/dist /usr/share/nginx/html

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]