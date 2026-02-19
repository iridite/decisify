# Decisify Screenshots

This directory contains project screenshots for documentation and Hackathon submission.

## Files

### 1. dashboard-overview.png
- **Size**: 1920x1937 (266KB)
- **Description**: Full dashboard view showing multi-source signal aggregation
- **Features shown**:
  - Real-time signal cards from multiple sources
  - Confidence scores and reasoning traces
  - Clean, modern UI design

### 2. signal-detail.png
- **Size**: 1920x1080 (168KB)
- **Description**: Detailed view of a single signal
- **Features shown**:
  - Transparent reasoning process
  - Data source attribution
  - Confidence breakdown

### 3. decision-flow.png
- **Size**: 1920x1080 (126KB)
- **Description**: Decision flow visualization
- **Features shown**:
  - Multi-signal fusion process
  - Attention mechanism visualization
  - Decision support interface

## Generation

Screenshots were automatically generated using Puppeteer:
- Date: 2026-02-19
- Environment: Vite dev server (localhost:5173)
- Resolution: 1920x1080+ (high DPI)
- Format: PNG (lossless)

## Usage

These screenshots are used in:
- README.md (project documentation)
- SUBMISSION_BRIEF.md (Hackathon submission)
- GitHub Pages (live demo documentation)

## Regeneration

To regenerate screenshots:
```bash
# Start backend
cd backend && source venv/bin/activate && python -m decisify.main &

# Start frontend
cd frontend && npm run dev &

# Run screenshot script
cd dashboard && node take-screenshots.js
```
