# Screenshot Guide for Decisify Demo

## Required Screenshots

### 1. Dashboard Overview (`dashboard-overview.png`)
**URL:** https://iridite.github.io/decisify/

**What to capture:**
- Full browser window showing the complete dashboard
- Left panel: Agent Reasoning Trace with decision history
- Center: Decision Pipeline visualization
- Right panel: Intelligence Feed (X, Polymarket, Nautilus)

**Key elements to show:**
- Real-time decision updates
- Attention weights visualization
- Safety gate status
- Multi-source signal integration

**Recommended size:** 1920x1080 (Full HD)

---

### 2. Decision Pipeline (`decision-pipeline.png`)
**URL:** https://iridite.github.io/decisify/

**What to capture:**
- Focus on the center decision pipeline section
- Show the flow: Perception → Attention Fusion → Safety Gate → Action
- Highlight attention weights distribution
- Show safety validation status

**Key elements to show:**
- Attention weights breakdown (pie chart or bars)
- Safety gate rules and validation
- Decision confidence score
- Reasoning trace

**Recommended size:** 1280x720 (HD)

---

### 3. Intelligence Feed (`intelligence-feed.png`)
**URL:** https://iridite.github.io/decisify/

**What to capture:**
- Focus on the right panel with intelligence feeds
- Show X Intelligence sentiment analysis
- Show Polymarket prediction odds
- Show Nautilus trading signals

**Key elements to show:**
- Real-time signal updates
- Confidence scores for each source
- Context/explanation for each signal
- Timestamp information

**Recommended size:** 800x1200 (Vertical focus)

---

## Manual Screenshot Instructions

### Using Firefox (Linux)

```bash
# Full page screenshot
firefox --screenshot dashboard-overview.png --window-size=1920,1080 https://iridite.github.io/decisify/

# Wait for page to load, then take screenshot
firefox https://iridite.github.io/decisify/
# Press Shift+F2 to open developer toolbar
# Type: screenshot dashboard-overview.png --fullpage
```

### Using Chrome/Chromium (Linux)

```bash
# Full page screenshot
chromium --headless --screenshot=dashboard-overview.png --window-size=1920,1080 https://iridite.github.io/decisify/

# Or with Chrome DevTools
chromium https://iridite.github.io/decisify/
# Press F12 → Ctrl+Shift+P → Type "screenshot" → Select "Capture full size screenshot"
```

### Using Browser Extensions

**Recommended:** Nimbus Screenshot, Awesome Screenshot, or Fireshot

1. Install extension from browser store
2. Navigate to https://iridite.github.io/decisify/
3. Click extension icon
4. Select "Capture entire page" or "Capture visible area"
5. Save as PNG with appropriate filename

---

## Screenshot Checklist

- [ ] `dashboard-overview.png` - Full dashboard view (1920x1080)
- [ ] `decision-pipeline.png` - Decision flow focus (1280x720)
- [ ] `intelligence-feed.png` - Signal sources focus (800x1200)

**Optional additional screenshots:**
- [ ] `agent-reasoning.png` - Reasoning trace detail
- [ ] `attention-weights.png` - Attention mechanism visualization
- [ ] `safety-gate.png` - Safety validation detail
- [ ] `mobile-view.png` - Mobile responsive design (375x812)

---

## Post-Processing (Optional)

### Using ImageMagick

```bash
# Resize to consistent width
convert dashboard-overview.png -resize 1920x dashboard-overview.png

# Add border
convert dashboard-overview.png -border 2x2 -bordercolor black dashboard-overview.png

# Compress
convert dashboard-overview.png -quality 85 dashboard-overview.png
```

### Using GIMP

1. Open screenshot in GIMP
2. Image → Scale Image → Set width to 1920px
3. Filters → Enhance → Sharpen (if needed)
4. File → Export As → PNG (compression level 6)

---

## Placement in Repository

Save all screenshots to:
```
/home/yixian/Playground/decisify/docs/screenshots/
```

Update README.md image links:
```markdown
![Agent Dashboard Overview](docs/screenshots/dashboard-overview.png)
![Decision Pipeline](docs/screenshots/decision-pipeline.png)
![Intelligence Feed](docs/screenshots/intelligence-feed.png)
```

---

## Alternative: Use Playwright for Automated Screenshots

If you have Node.js installed:

```bash
cd /home/yixian/Playground/decisify
npm install -D @playwright/test

# Create screenshot script
cat > take-screenshots.js << 'EOF'
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('https://iridite.github.io/decisify/');
  await page.waitForTimeout(3000); // Wait for animations
  
  await page.screenshot({ path: 'docs/screenshots/dashboard-overview.png', fullPage: true });
  
  await browser.close();
})();
EOF

node take-screenshots.js
```

---

## Tips for Best Screenshots

1. **Wait for data to load** - Give the dashboard 3-5 seconds to populate with mock data
2. **Capture during active state** - Show decisions being made, not idle state
3. **Use high resolution** - At least 1920px width for main screenshots
4. **Clean browser UI** - Hide bookmarks bar, extensions, etc.
5. **Consistent theme** - Use dark mode (dashboard default)
6. **Show real data** - Ensure mock data is displaying properly

---

**Last Updated:** 2026-02-19
