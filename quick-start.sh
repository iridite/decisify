#!/bin/bash

# Decisify 一键部署脚本
# 快速启动后端和前端服务

set -e  # 遇到错误立即退出

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                      DECISIFY                             ║"
echo "║              一键部署脚本 Quick Start                      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 打印成功消息
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# 打印警告消息
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 打印错误消息
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 检查 Python 版本
check_python() {
    if command_exists python3; then
        PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
        REQUIRED_VERSION="3.10"

        if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
            print_success "Python $PYTHON_VERSION 已安装"
            return 0
        else
            print_error "需要 Python 3.10+，当前版本: $PYTHON_VERSION"
            return 1
        fi
    else
        print_error "未找到 Python 3"
        return 1
    fi
}

# 检查 Node.js 版本
check_node() {
    if command_exists node; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 18 ]; then
            print_success "Node.js $(node --version) 已安装"
            return 0
        else
            print_warning "建议使用 Node.js 18+，当前版本: $(node --version)"
            return 0
        fi
    else
        print_error "未找到 Node.js"
        return 1
    fi
}

# 安装后端依赖
install_backend() {
    echo ""
    echo "📦 安装后端依赖..."

    if command_exists uv; then
        print_success "使用 uv 安装依赖（推荐）"
        uv pip install -e .
    elif command_exists pip; then
        print_warning "使用 pip 安装依赖"
        pip install -e .
    else
        print_error "未找到 pip 或 uv"
        return 1
    fi

    print_success "后端依赖安装完成"
}

# 构建 Rust 扩展（可选）
build_rust() {
    echo ""
    echo "⚡ 构建 Rust 性能扩展（可选）..."

    if command_exists cargo && command_exists maturin; then
        cd rust
        PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1 maturin develop --release
        cd ..
        print_success "Rust 扩展构建完成"
    else
        print_warning "未找到 Rust/Maturin，跳过性能扩展（系统将使用纯 Python 实现）"
    fi
}

# 安装前端依赖
install_frontend() {
    echo ""
    echo "📦 安装前端依赖..."

    cd dashboard
    npm install
    cd ..

    print_success "前端依赖安装完成"
}

# 启动后端服务
start_backend() {
    echo ""
    echo "🚀 启动后端服务..."

    if command_exists uv; then
        uv run python main.py &
    else
        python3 main.py &
    fi

    BACKEND_PID=$!
    echo $BACKEND_PID > .backend.pid

    print_success "后端服务已启动 (PID: $BACKEND_PID)"
    print_success "API 地址: http://localhost:8000"
}

# 启动前端服务
start_frontend() {
    echo ""
    echo "🎨 启动前端服务..."

    cd dashboard
    npm run dev &
    FRONTEND_PID=$!
    cd ..

    echo $FRONTEND_PID > .frontend.pid

    print_success "前端服务已启动 (PID: $FRONTEND_PID)"
    print_success "Dashboard 地址: http://localhost:5173"
}

# 清理函数
cleanup() {
    echo ""
    echo "🛑 正在停止服务..."

    if [ -f .backend.pid ]; then
        BACKEND_PID=$(cat .backend.pid)
        kill $BACKEND_PID 2>/dev/null || true
        rm .backend.pid
        print_success "后端服务已停止"
    fi

    if [ -f .frontend.pid ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        kill $FRONTEND_PID 2>/dev/null || true
        rm .frontend.pid
        print_success "前端服务已停止"
    fi

    exit 0
}

# 捕获 Ctrl+C
trap cleanup SIGINT SIGTERM

# 主流程
main() {
    # 检查依赖
    echo "🔍 检查系统依赖..."
    check_python || exit 1
    check_node || exit 1

    # 询问是否安装依赖
    read -p "是否需要安装依赖？(y/n) [默认: n]: " INSTALL_DEPS
    INSTALL_DEPS=${INSTALL_DEPS:-n}

    if [ "$INSTALL_DEPS" = "y" ] || [ "$INSTALL_DEPS" = "Y" ]; then
        install_backend

        # 询问是否构建 Rust 扩展
        read -p "是否构建 Rust 性能扩展？(y/n) [默认: n]: " BUILD_RUST
        BUILD_RUST=${BUILD_RUST:-n}

        if [ "$BUILD_RUST" = "y" ] || [ "$BUILD_RUST" = "Y" ]; then
            build_rust
        fi

        install_frontend
    fi

    # 启动服务
    start_backend
    sleep 3  # 等待后端启动
    start_frontend

    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                   🎉 启动成功！                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    echo "📍 访问地址："
    echo "   • Dashboard: http://localhost:5173"
    echo "   • API 文档:  http://localhost:8000/docs"
    echo "   • 健康检查:  http://localhost:8000/health"
    echo ""
    echo "💡 提示："
    echo "   • 按 Ctrl+C 停止所有服务"
    echo "   • 查看日志: tail -f logs/*.log"
    echo ""

    # 保持脚本运行
    wait
}

# 运行主流程
main
