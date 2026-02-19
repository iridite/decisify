# Screenshot Guide for Decisify

Since automated screenshot tools are not available, please manually capture the following screenshots from the live demo:

## Required Screenshots

### 1. Dashboard Overview (`dashboard-overview.png`)
**URL:** https://iridite.github.io/decisify/

**What to capture:**
- Full dashboard view showing the main interface
- Agent reasoning trace panel
- Decision pipeline visualization
- Multi-source signal indicators
- Recommended size: 1920x1080

**How to capture:**
1. Open https://iridite.github.io/decisify/ in your browser
2. Wait for the dashboard to fully load with live data
3. Press `F12` to open DevTools
4. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
5. Type "Capture full size screenshot" and press Enter
6. Save as `docs/screenshots/dashboard-overview.png`

### 2. Decision Pipeline (`decision-pipeline.png`)
**URL:** https://iridite.github.io/decisify/

**What to capture:**
- Focus on the decision pipeline section
- Show attention weights visualization
- Safety gate validation status
- Transparent reasoning trace
- Recommended size: 1920x1080

**How to capture:**
1. Scroll to highlight the decision pipeline section
2. Use the same screenshot method as above
3. Save as `docs/screenshots/decision-pipeline.png`

### 3. Intelligence Feed (`intelligence-feed.png`)
**URL:** https://iridite.github.io/decisify/

**What to capture:**
- Multi-source intelligence panel
- X Intelligence feed
- Polymarket integration
- Nautilus signals
- Real-time data updates
- Recommended size: 1920x1080

**How to capture:**
1. Focus on the intelligence feed section
2. Capture when live data is visible
3. Save as `docs/screenshots/intelligence-feed.png`

## Alternative: Using Browser DevTools

If you prefer a more precise approach:

```javascript
// Open browser console and run:
// This will download a full-page screenshot
const canvas = await html2canvas(document.body);
const link = document.createElement('a');
link.download = 'dashboard-overview.png';
link.href = canvas.toDataURL();
link.click();
```

## Quick Method (macOS)

```bash
# Use built-in screenshot tool
# Press Cmd+Shift+4, then Space, then click the browser window
# Or use Cmd+Shift+3 for full screen
```

## Quick Method (Linux)

```bash
# Using GNOME Screenshot
gnome-screenshot -w -f docs/screenshots/dashboard-overview.png

# Or using scrot
scrot -u docs/screenshots/dashboard-overview.png

# Or using import (ImageMagick)
import -window root docs/screenshots/dashboard-overview.png
```

## After Capturing

Once you have all three screenshots:

```bash
cd /home/yixian/Playground/decisify
git add docs/screenshots/
git commit -m "docs: add dashboard screenshots"
git push origin main
```

The README.md already references these screenshots, so they will display automatically once uploaded.
