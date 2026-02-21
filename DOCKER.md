# Docker 部署指南

> 使用 Docker 快速启动 Decisify，无需配置 Python 环境

## 🎯 为什么使用 Docker？

- ✅ **零配置** - 无需安装 Python、uv 或其他依赖
- ✅ **环境隔离** - 避免依赖冲突
- ✅ **一键启动** - 适合评委快速验证项目
- ✅ **跨平台** - 在 Linux、macOS、Windows 上运行一致

## 📋 前置要求

- Docker 20.10+
- Docker Compose 2.0+

### 安装 Docker

**macOS / Windows:**
- 下载并安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin

# 启动 Docker 服务
sudo systemctl start docker
sudo systemctl enable docker
```

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/iridite/decisify.git
cd decisify
```

### 2. 启动服务

```bash
# 构建并启动（首次运行）
docker-compose up -d

# 查看日志
docker-compose logs -f decisify
```

### 3. 访问服务

- **API 服务**: http://localhost:8000
- **API 文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health
- **系统状态**: http://localhost:8000/status

### 4. 停止服务

```bash
docker-compose down
```

## 📝 常用命令

### 查看运行状态

```bash
docker-compose ps
```

### 查看实时日志

```bash
# 查看所有日志
docker-compose logs -f

# 只查看最近 100 行
docker-compose logs --tail=100 -f
```

### 重启服务

```bash
docker-compose restart
```

### 重新构建镜像

```bash
# 当代码更新后需要重新构建
docker-compose up -d --build
```

### 进入容器

```bash
# 进入容器内部调试
docker-compose exec decisify /bin/bash
```

### 清理资源

```bash
# 停止并删除容器
docker-compose down

# 同时删除数据卷
docker-compose down -v

# 删除镜像
docker rmi decisify-decisify
```

## ⚙️ 配置说明

### 环境变量

在 `docker-compose.yml` 中修改环境变量：

```yaml
services:
  decisify:
    environment:
      - CYCLE_INTERVAL=5.0        # 决策周期（秒）
      - AGENT_TEMPERATURE=1.0     # 注意力温度
      - MAX_VOLATILITY_BUY=0.05   # BUY 波动率阈值
      - MAX_VOLATILITY_SELL=0.08  # SELL 波动率阈值
      - LOG_LEVEL=INFO            # 日志级别
```

### 端口映射

默认映射 `8000:8000`，如需修改：

```yaml
services:
  decisify:
    ports:
      - "9000:8000"  # 将容器的 8000 映射到主机的 9000
```

### 数据持久化

如需持久化日志或数据：

```yaml
services:
  decisify:
    volumes:
      - ./logs:/app/logs  # 持久化日志
```

## 🔍 健康检查

Docker 容器内置健康检查：

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' decisify-backend

# 查看健康检查日志
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' decisify-backend
```

健康检查配置：
- 检查间隔：30 秒
- 超时时间：10 秒
- 重试次数：3 次
- 启动等待：10 秒

## 🐛 故障排除

### 端口已被占用

**错误信息：**
```
Error: bind: address already in use
```

**解决方案：**
```bash
# 查找占用 8000 端口的进程
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# 修改 docker-compose.yml 中的端口映射
ports:
  - "8001:8000"
```

### 容器启动失败

**检查日志：**
```bash
docker-compose logs decisify
```

**常见原因：**
1. 依赖安装失败 - 检查网络连接
2. 配置错误 - 检查环境变量
3. 权限问题 - 确保 Docker 有足够权限

### 无法访问服务

**检查容器状态：**
```bash
docker-compose ps
```

**检查健康状态：**
```bash
curl http://localhost:8000/health
```

**重启服务：**
```bash
docker-compose restart
```

### 镜像构建慢

**使用国内镜像源：**

在 `Dockerfile` 中添加：
```dockerfile
# 使用清华大学 PyPI 镜像
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

## 📊 性能监控

### 查看资源使用

```bash
# 实时监控
docker stats decisify-backend

# 查看容器详情
docker inspect decisify-backend
```

### 查看决策周期

```bash
# 实时查看决策输出
docker-compose logs -f | grep "Cycle #"
```

### 监控 API 性能

```bash
# 查看性能指标
curl http://localhost:8000/metrics | jq
```

## 🔧 开发模式

如需在 Docker 中进行开发（代码热重载）：

```yaml
services:
  decisify:
    volumes:
      - ./src:/app/src:ro      # 挂载源代码
      - ./main.py:/app/main.py:ro
    environment:
      - RELOAD=true            # 启用自动重载
```

然后重启：
```bash
docker-compose up -d
```

## 📚 更多资源

- **项目主页**: https://github.com/iridite/decisify
- **在线演示**: https://iridite.github.io/decisify/
- **完整文档**: [README.md](README.md)
- **API 文档**: http://localhost:8000/docs（启动后访问）

## 💡 提示

1. **首次启动较慢** - 需要下载基础镜像和安装依赖，后续启动会很快
2. **日志查看** - 使用 `docker-compose logs -f` 实时查看运行状态
3. **配置修改** - 修改 `docker-compose.yml` 后需要重启服务
4. **清理资源** - 定期运行 `docker system prune` 清理未使用的资源

---

**快速验证项目：**
```bash
# 一键启动
docker-compose up -d && docker-compose logs -f

# 在另一个终端测试 API
curl http://localhost:8000/status | jq
```

🎉 享受使用 Decisify！