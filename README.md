# 🐾 AniDex - Real-World Wildlife Pokédex

> **An interactive, retro-futuristic fauna scanner and natural history field journal powered by Gemini Vision & Speech AI.**

[![Live Demo](https://img.shields.io/badge/Demo-Live%20App-00C49F?style=for-the-badge&logo=google-chrome&logoColor=white)](https://ais-pre-rwue6j53rezc27bjdrep67-117226100308.asia-east1.run.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google GenAI](https://img.shields.io/badge/Google-Gemini%20Vision-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🌐 Live Published Application

You can test and explore the live published web application here:
👉 **[Launch AniDex Live App](https://ais-pre-rwue6j53rezc27bjdrep67-117226100308.asia-east1.run.app)**

---

## ✨ Features

- 📸 **AI Vision Fauna Scanner**: Point your camera or upload a photo of any wild animal, bird, reptile, amphibian, insect, or marine creature for instant taxonomy classification.
- 🔊 **Hands-Free Naturalist Voice Briefings**: Listen to high-fidelity spoken field briefings narrated by an AI naturalist guide with play/pause controls.
- 📊 **Scientific Telemetry & Biometrics**:
  - Binomial Nomenclature (Scientific names)
  - IUCN Red List Conservation status (Least Concern, Vulnerable, Endangered, etc.)
  - Native biomes and geographic range
  - Diet, behavioral habits, and outdoor encounter safety tips
  - 3 fascinating scientific fun facts per species
- 📖 **Field Journal Collection Gallery**:
  - Keep track of all captured specimens
  - Star favorites
  - Search and filter by category (Mammals, Birds, Reptiles, Invertebrates, Marine)
  - Persistent browser storage with hydration-safe synchronization
- 🎮 **Authentic Pokédex Aesthetic**:
  - CRT scanline shaders and animated tactile LEDs
  - Authentic Pokédex chimes and retro-futuristic sound effects
  - Audio visualizer waveforms and stitched nature cards

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or Bun / pnpm / yarn)
- A Google Gemini API Key ([Get one free at Google AI Studio](https://aistudio.google.com/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the local development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Deploying to Vercel

When deploying this Next.js app to Vercel, you **must configure your `GEMINI_API_KEY`** in Vercel:

1. **Import your GitHub repository** on [Vercel](https://vercel.com/new).
2. Under the **Environment Variables** section before deploying (or in **Project Settings > Environment Variables**):
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))
   - Select all environments: **Production**, **Preview**, **Development**.
3. Click **Deploy** (or if already deployed, go to the **Deployments** tab, click **`...`** on the latest deployment, and click **Redeploy**).

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Models**: Google GenAI SDK (`@google/genai`)
  - Multimodal Vision: `gemini-3.8-flash`
  - Text-to-Speech: `gemini-3.1-flash-tts-preview` with browser Web Speech API fallback
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
