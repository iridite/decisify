# 🎬 Decisify Demo - Quick Start Guide

## For Hackathon Judges & Reviewers

This is a **one-command demo** to showcase Decisify's AI decision engine capabilities.

### 🚀 Quick Start (Recommended)

```bash
python demo.py
```

That's it! The script will:
- ✅ Start the backend decision engine
- ✅ Start the frontend dashboard
- ✅ Auto-open your browser to the dashboard
- ✅ Begin real-time decision cycles

### 📍 Access Points

Once running, you can access:

- **Dashboard**: http://localhost:5173/decisify/
- **API**: http://localhost:8000
- **Metrics**: http://localhost:8000/metrics
- **API Docs**: http://localhost:8000/docs

### 🎯 What to Watch

1. **Real-time Decision Loop** (5-second cycles)
   - Watch the agent perceive → reason → decide in real-time
   - Each cycle processes multiple data sources

2. **AI Explanations**
   - Natural language reasoning for every decision
   - Full transparency into the "why" behind each action

3. **Multi-Source Triangulation**
   - Polymarket odds
   - X (Twitter) sentiment
   - Nautilus trading signals
   - Dynamic weight adjustment

4. **Rust Performance**
   - Live comparison showing 50-100x speedup
   - Real metrics from hybrid Python/Rust architecture

5. **Safety Gates**
   - Watch the system override risky decisions
   - Transparent safety interventions

### 🛠️ Manual Start (Alternative)

If you prefer to start services separately:

**Backend:**
```bash
python main.py --demo
```

**Frontend:**
```bash
cd dashboard
npm run dev
```

### ⏹️ Stopping the Demo

Press `Ctrl+C` in the terminal where you ran `python demo.py`

### 📦 Requirements

- Python 3.11+
- Node.js 18+
- Dependencies installed (see main README.md)

### 🏆 Hackathon Track Alignment

This project is built for **Rebel in Paradise AI Hackathon - Track 2**:
- ✅ Autonomous AI agent with perception-reasoning-execution loop
- ✅ Multi-source data fusion and attention mechanisms
- ✅ Transparent decision-making with explainable AI
- ✅ Real-world applicability (trading, risk management)
- ✅ Performance optimization (Rust integration)

### 💡 Key Features to Notice

- **Attention Fusion**: Dynamic weight adjustment based on signal quality
- **Explainable AI**: Every decision comes with natural language explanation
- **Safety First**: Built-in safety gates prevent risky actions
- **Hybrid Architecture**: Python for AI, Rust for performance-critical paths
- **Real-time Monitoring**: Live dashboard with all internal state visible

---

**Questions?** Check the main [README.md](../README.md) for full documentation.
