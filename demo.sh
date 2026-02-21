#!/bin/bash

# Decisify Demo Mode - Quick Start for Hackathon Judges
# This script launches both backend and frontend in demo mode

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              DECISIFY - DEMO MODE                         ║"
echo "║      AI Decision Engine with Full Transparency            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 Starting Decisify in demo mode..."
echo ""

# Check if dashboard is already running
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Dashboard already running on port 5173"
else
    echo "📊 Starting Dashboard (Frontend)..."
    cd dashboard
    npm run dev &
    DASHBOARD_PID=$!
    cd ..
    echo "   Dashboard PID: $DASHBOARD_PID"
    sleep 2
fi

# Check if backend is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "✅ Backend already running on port 8000"
else
    echo "🧠 Starting Decision Engine (Backend)..."
    python main.py --demo &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✨ Decisify is now running in DEMO MODE!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📍 Access Points:"
echo "   🌐 Dashboard:  http://localhost:5173/decisify/"
echo "   🔌 API:        http://localhost:8000"
echo "   📊 Metrics:    http://localhost:8000/metrics"
echo ""
echo "🎯 What to Watch:"
echo "   • Real-time decision loop (5-second cycles)"
echo "   • AI reasoning explanations in natural language"
echo "   • Multi-source signal triangulation"
echo "   • Rust vs Python performance comparison"
echo "   • Safety gate interventions"
echo ""
echo "⏹️  Press Ctrl+C to stop all services"
echo "═══════════════════════════════════════════════════════════"

# Wait for user interrupt
wait
