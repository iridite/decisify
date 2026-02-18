# Decisify Dashboard

> **Agent Intelligence Monitor** - A high-density financial intelligence dashboard for the Decisify perception-to-action pipeline.

Built for the **Agent Symbiosis Track** - demonstrating human-agent collaboration through transparent reasoning traces and feedback loops.

## 🎯 Project Mission

Decisify bridges raw social signals (X/Twitter) and intelligent markets (Polymarket) through a specialized monitoring & reasoning framework. This dashboard serves as the **visual interface for agent-human symbiosis**, allowing humans to:

- 🧠 **Audit Agent Reasoning** - See exactly how the agent thinks
- 👍 **Provide Feedback** - Reinforce or correct agent decisions
- ⚡ **Approve Actions** - Human-in-the-loop execution control
- 📊 **Monitor Triangulation** - Track correlation between data sources

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  PERCEPTION LAYER                            │
│  (X Intelligence + Polymarket + Nautilus Quant)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  REASONING LAYER                             │
│  (Triangulation Engine + Agent Thought Generation)          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                PRESENTATION LAYER (This Dashboard)           │
│  (Reasoning Trace + Human Feedback + Execution Control)     │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Key Features

### 1. Agent Thought Log
- Real-time streaming of agent reasoning steps
- Confidence scores with visual indicators
- Human feedback mechanism (👍/👎)
- Expandable details showing input sources

### 2. Triangulation Matrix
- 3x3 correlation matrix between data sources
- Visual heatmap of alignment strength
- Overall consensus interpretation

### 3. X Intelligence Feed
- Curated social signals with sentiment analysis
- Agent relevance scoring
- Impact assessment per signal

### 4. Strategy Proposal System
- Agent-generated action recommendations
- Risk assessment and confidence levels
- Human approval/rejection interface (HITL)

### 5. Context Memory Tracker
- Visual timeline of tracked events
- Relevance decay visualization
- 8-hour rolling context window

### 6. Polymarket Odds Tracker
- Real-time prediction market odds
- Historical trend visualization
- Delta indicators (1h, 24h)

### 7. Nautilus Quant Snapshot
- Live trading strategy status
- P&L tracking
- Technical indicator display

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
cd dashboard
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the dashboard.

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Data Flow

### Static Mode (GitHub Pages)
1. GitHub Actions runs `scripts/fetch_data.py` every 5 minutes
2. Script fetches data from Decisify API
3. Transforms data into `dashboard/public/data.json`
4. Frontend polls JSON file and displays with streaming animations

### Development Mode (Local API)
1. Run Decisify backend: `python main.py`
2. Update `useDataPolling.js` to point to `http://localhost:8000/status`
3. Dashboard fetches live data directly from API

## 🎨 Design System

### Colors
- **Midnight Onyx**: `#09090b` - Background
- **Iridyne Green**: `#00ffc2` - Bullish signals, live indicators
- **Volatility Orange**: `#f59e0b` - Warnings, bearish signals
- **Border Subtle**: `#27272a` - Borders and dividers

### Typography
- **Monospace**: JetBrains Mono for all numerical data
- **Sans-serif**: System fonts for text content

### Layout
- **Bento Grid**: High-density modular layout
- **Glassmorphism**: Subtle backdrop blur effects
- **1px Borders**: Minimal separation between modules

## 🤖 Agent Symbiosis Features

### Human Feedback Loop
```javascript
// Users can provide feedback on agent reasoning
submitFeedback(thoughtId, 'positive' | 'negative')
```

Feedback is stored in `localStorage` and can be collected via GitHub Actions for agent improvement.

### Human-in-the-Loop Execution
```javascript
// Users must approve high-risk actions
handleProposal(proposalId, 'approved' | 'rejected')
```

Ensures critical decisions have human oversight.

### Reasoning Transparency
Every agent decision includes:
- Input sources and their weights
- Confidence score
- Reasoning explanation
- Safety check results

## 📁 Project Structure

```
dashboard/
├── public/
│   └── data.json           # Data source (updated by GitHub Actions)
├── src/
│   ├── App.jsx            # Main dashboard component
│   ├── main.jsx           # React entry point
│   ├── index.css          # Global styles + Tailwind
│   └── hooks/
│       └── useDataPolling.js  # Data fetching & streaming logic
├── index.html             # HTML entry
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## 🔧 Configuration

### Polling Interval
Edit `useDataPolling.js`:
```javascript
const { data } = useDataPolling(30000); // 30 seconds
```

### API Endpoint
For local development, modify `useDataPolling.js`:
```javascript
const response = await fetch('http://localhost:8000/status');
```

## 🚢 Deployment

### GitHub Pages (Recommended)

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch
4. Dashboard auto-deploys to `https://<username>.github.io/decisify/`

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to any static hosting service
```

## 🧪 Testing

### Manual Testing
1. Modify `public/data.json` timestamp
2. Observe UI auto-update with streaming animations
3. Test feedback buttons and proposal approval

### Performance Testing
- Use Chrome DevTools Performance panel
- Target: 60fps for all animations
- Monitor memory usage during long sessions

## 🎯 Hackathon Alignment

This project addresses **Track 2: Agent Symbiosis** by:

1. ✅ **Long-term Context Management**: 8-hour rolling context window with relevance decay
2. ✅ **Agent Workflow Design**: Perception → Reasoning → Execution pipeline
3. ✅ **Data-Perception-Execution Synergy**: Triangulation of multiple data sources
4. ✅ **Human-Agent Collaboration**: Feedback loops and approval mechanisms
5. ✅ **Crypto-Native**: Integration with Polymarket prediction markets

## 📝 License

MIT

## 🙏 Acknowledgments

Built for the Iridyne ecosystem, integrating:
- **Decisify**: Core reasoning engine
- **Nautilus-Ops**: Quantitative trading signals
- **Polymarket**: Prediction market intelligence
- **X/Twitter**: Social sentiment analysis

---

**Iridyne / Decisify** - Where Agents and Humans Think Together
