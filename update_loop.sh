#!/bin/bash
# 自动更新 dashboard 数据的循环脚本

cd "$(dirname "$0")"
source .venv/bin/activate

echo "🚀 启动数据自动更新循环 (每30秒更新一次)"
echo "按 Ctrl+C 停止"

while true; do
    echo "⏰ $(date '+%Y-%m-%d %H:%M:%S') - 更新数据..."
    python scripts/fetch_data.py
    sleep 30
done
