#!/bin/bash
# Build script for Rust extension

set -e

echo "🦀 Building Decisify Rust Extension"
echo "===================================="

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo "❌ Rust not found. Install from https://rustup.rs/"
    exit 1
fi

# Check if maturin is installed
if ! command -v maturin &> /dev/null; then
    echo "📦 Installing maturin..."
    pip install maturin
fi

# Build the Rust extension
echo "🔨 Building Rust extension..."
cd rust
maturin develop --release

echo "✅ Build complete!"
echo ""
echo "To use Rust acceleration:"
echo "  from brain_hybrid import HybridAttentionEngine"
echo "  engine = HybridAttentionEngine(use_rust=True)"
