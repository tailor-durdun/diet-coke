# Diet Coke — Caffeine Free Experience

An interactive, high-performance web showcase for **Diet Coke (Caffeine Free)** featuring a fluid canvas-driven scroll animation, transparent glassmorphism navigation, sensory architecture, product collection, and store locator.

## 🌟 Features

- **60FPS Frame-Synced Scroll Animation**: 210-frame high-resolution 3D can reveal synced to wheel, touch, and scroll.
- **Dynamic 30% Hero Fade**: Refined black headline and signature Coca-Cola Red subheading positioned in the center above the can that smoothly fade out as scrolling begins.
- **Transparent Glass Navigation Bar**: Sleek, compact navbar with section-by-section smooth scrolling (`Overview`, `Taste Profile`, `Pack Formats`, `The Ritual`, `Nutrition`, `Where to Buy`), active scroll spy, and a responsive mobile dropdown.
- **Product Experience Sections**:
  - Quick Stat Badges (`0g Sugar`, `0mg Caffeine`, `100% Sparkle`, `Infinite Loop`)
  - The Anatomy of the Chill (Sensory 3-phase progression and flavor balance meters)
  - Tailored Pack Formats (330ml Can, 500ml Bottle, 8-Pack Fridge Dispenser, 2L Bottle)
  - The Golden Ritual (Target 3°C serve guide)
  - Nutritional Transparency (Typical values & ingredient breakdown)
  - Availability Radar & Stockist Locator (Interactive zip search & delivery app integration)
  - Taste Club Insider Club sign-up & comprehensive footer

## 🚀 One-Click Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftailor-durdun%2Fdiet-coke)

This project is pre-configured for **zero-config deployment on [Vercel](https://vercel.com/)**:

### Option 1: Import via Vercel Dashboard (Recommended)
1. Click the **Deploy with Vercel** button above, or go to [vercel.com/new](https://vercel.com/new).
2. Import repository: `tailor-durdun/diet-coke`.
3. Keep default settings (Framework Preset: **Other** / Static).
4. Click **Deploy**. Vercel will automatically build and publish the site with Edge CDN caching enabled.

### Option 2: Deploy using Vercel CLI
```bash
npm i -g vercel
vercel
```

### ⚡ Caching & Performance
Includes `vercel.json` with Edge CDN immutable cache rules (`public, max-age=31536000, immutable`) for all 210 animation frames for lightning-fast loads.

## 💻 Local Development

Simply open `index.html` in your browser, or start a local server:

```bash
# Using Python
python -m http.server 3000

# Or using npx
npx serve .
```
Then visit `http://localhost:3000`.
