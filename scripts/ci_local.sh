#!/bin/bash
# 本地运行所有 CI 检查

set -e  # 遇到错误立即退出

echo "================================"
echo "🔧 本地 CI 检查开始"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查函数
run_check() {
    local name=$1
    shift
    echo -e "${YELLOW}▶ 运行: $name${NC}"
    if "$@"; then
        echo -e "${GREEN}✓ $name 通过${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ $name 失败${NC}"
        echo ""
        return 1
    fi
}

# 1. 安装依赖
echo -e "${YELLOW}▶ 安装依赖${NC}"
uv sync --all-extras
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 2. Linter 检查
run_check "Ruff Linter" uv run ruff check .

# 3. 类型检查
run_check "MyPy 类型检查" uv run mypy src/

# 4. 安全检查
run_check "Bandit 安全检查" uv run bandit -r src/ -c pyproject.toml

# 5. 测试 + 覆盖率
run_check "Pytest 测试" uv run pytest tests/ --ignore=tests/test_api.py --cov=src --cov-report=xml --cov-report=term

# 6. 基准测试（可选，不影响 CI）
echo -e "${YELLOW}▶ 运行基准测试（可选）${NC}"
echo "运行单决策基准测试..."
uv run python benchmarks/benchmark.py || echo -e "${YELLOW}⚠ 基准测试跳过${NC}"
echo ""

echo "================================"
echo -e "${GREEN}✅ 所有 CI 检查通过！${NC}"
echo "================================"
