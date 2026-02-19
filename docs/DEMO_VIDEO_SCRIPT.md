# Decisify Demo Video Script (3 minutes)

## 0:00-0:30 - Opening

**Visual:** Live Demo homepage loading
**Narration:**
> "Welcome to Decisify - an AI-powered decision intelligence platform built for the Rebel in Paradise Hackathon. This is a real-time agent that goes beyond chat - it perceives, reasons, and executes decisions autonomously."

**Show:**
- Live Demo URL: https://iridite.github.io/decisify/
- Dashboard overview with live data
- Key metrics updating in real-time

## 0:30-1:30 - Core Features

**Visual:** Navigate through main dashboard sections
**Narration:**
> "Decisify implements a complete perception-to-action pipeline. Watch as the agent continuously processes signals from multiple sources - social media sentiment, market volatility, and news feeds. The attention fusion engine weighs each signal using a softmax mechanism, creating transparent, explainable decisions."

**Show:**
- Agent reasoning trace panel (live updates)
- Multi-source signal fusion visualization
- Attention weights changing in real-time
- Decision pipeline: Perception → Reasoning → Safety Gate → Execution

**Highlight:**
- Real-time cycle counter
- Signal sources: Twitter sentiment, price volatility, news feed
- Attention weight distribution (percentage breakdown)

## 1:30-2:30 - Technical Highlights

**Visual:** Architecture diagram + code snippets
**Narration:**
> "The architecture combines Python's flexibility with Rust's performance. The async perception hub fetches signals concurrently, the hybrid attention engine processes them with up to 1.4x speedup using Rust acceleration, and the safety gate applies deterministic guardrails to prevent unsafe actions."

**Show:**
- Architecture diagram from README
- Code snippet: Attention fusion formula
- Performance benchmarks (Python vs Rust)
- Safety gate rules visualization

**Key Points:**
- FastAPI backend with 5-second decision cycles
- Hybrid Python + Rust implementation
- Safety-first design with volatility guards
- Full transparency: every decision includes reasoning trace

## 2:30-3:00 - Closing

**Visual:** Dashboard with successful decisions + GitHub repo
**Narration:**
> "Decisify demonstrates how agents can create real value through transparent execution, multi-modal perception, and human-agent symbiosis. The dashboard provides a feedback loop where humans can reinforce or correct agent decisions. This is the future of intelligent markets - not just chatbots, but autonomous decision engines with safety guarantees."

**Show:**
- Final dashboard view with multiple successful decisions
- GitHub repository: https://github.com/iridite/decisify
- Call to action: "Try the live demo, explore the code, and star the repo"

**End Screen:**
- Live Demo: https://iridite.github.io/decisify/
- GitHub: https://github.com/iridite/decisify
- Built for: Rebel in Paradise AI Hackathon - Track 2

---

## Recording Tips

### Tools
- **OBS Studio** (free, cross-platform): https://obsproject.com/
- **QuickTime Player** (macOS): Built-in screen recording
- **SimpleScreenRecorder** (Linux): Lightweight and reliable
- **Loom** (web-based): Quick and easy, but watermark on free tier

### Settings
- **Resolution:** 1920x1080 (1080p)
- **Frame rate:** 30 fps minimum, 60 fps preferred
- **Audio:** Clear narration, no background music (or very subtle)
- **Format:** MP4 (H.264 codec for best compatibility)

### Recording Workflow
1. **Prepare:** Open live demo in full-screen browser, test audio
2. **Script:** Have this script visible on second monitor or printed
3. **Practice:** Do a dry run to time each section
4. **Record:** Use OBS Studio with browser window capture
5. **Edit:** Trim intro/outro, add text overlays if needed (optional)
6. **Export:** MP4, 1080p, ~50-100 MB file size

### Narration Tips
- Speak clearly and at moderate pace
- Pause briefly between sections
- Show enthusiasm but stay professional
- Point out key features as they appear on screen
- Use cursor to highlight important elements

### Upload Destinations
- **YouTube:** Best for public sharing, good SEO
- **Vimeo:** Professional look, no ads
- **Bilibili:** If targeting Chinese audience
- **GitHub Release:** Attach as asset to a release

### After Upload
Update README.md with video link:
```markdown
[🎬 Demo Video](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)
```

---

## Quick 1-Minute Version (Optional)

If 3 minutes is too long, here's a condensed version:

**0:00-0:15** - Show live demo, explain "autonomous decision agent"
**0:15-0:40** - Demonstrate one complete decision cycle with reasoning trace
**0:40-0:55** - Highlight key tech: Python+Rust, safety gates, transparency
**0:55-1:00** - Call to action: try demo, star repo

This shorter version is perfect for social media (Twitter, LinkedIn) and quick pitches.
