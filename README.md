# 🌐 Kalos-Dex • 9th-Gen Spatial Holographic Pokédex

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![React_Three_Fiber](https://img.shields.io/badge/@react--three/fiber-v9-black?logo=three.js&logoColor=cyan)](https://r3f.docs.pmnd.rs/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer_Motion](https://img.shields.io/badge/Framer_Motion-12.4-black?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

An Awwwards-caliber, futuristic 9th-Generation Pokédex web application dedicated strictly to the Kalos region and Ash Ketchum's Kalos Championship arc. Built with **React 19**, **Three.js / React Three Fiber**, **Framer Motion**, and **Tailwind CSS v4**, this application delivers a guest-first, high-tech Holo-Caster spatial interface featuring 4K cinematic Kalos & Ash-Greninja visuals, authentic 3D circular Lumiose City urban cartography, a true-scale 3D holographic comparison arena with a 1.70m human Trainer reference, WebGL elemental particle environments, tactical team building with shared-weakness synergy detection, and competitive in-game formula calculation.

---

## 🌟 Visual & Thematic Excellence (Strictly 4K Kalos & Ash Theme)

* **4K Cinematic Hero Banners**: High-definition, authentic visual assets celebrating Ash Ketchum and Ash-Greninja (Bond Phenomenon), the Kalos Pokémon League, and legendary mascots (Xerneas of Life, Yveltal of Destruction, and Zygarde of Order).
* **Zero Cringe, Pure Decorum**: Clean glassmorphic typography, futuristic HUD status indicators, and minimalist cybernetic scanning bars with zero gimmicky delays or distracting flower animations.
* **Type-Reactive 3D WebGL Atmosphere (`<ParticleEnvironment />`)**: Single draw-call `instancedMesh` particle physics dynamically transforming into 10 elemental environments (Fire embers, Water buoyant bubbles, Electric lightning sparks, Ghost vortexes, Psychic wisps, Ice flutter).
* **3D Anti-Gravity Tilt & Dynamic Glare (`<SpatialCard />`)**: Mathematical perspective tilt reacting dynamically to pointer movement, accompanied by dynamic light sheen reflections and natural Z-space depth layering.

---

## 🚀 Key Features

### 1. 🏙️ Authentic 3D Circular Lumiose City Map (Diagram-Accurate)
Directly modeled after the official schematic of Lumiose City:
* **Centrico Plaza & Prism Tower**: The central hub featuring the Lumiose Gym spire with a vertical holographic beacon.
* **5 Concentric Colored Plazas**:
  * 🔴 **Rouge Plaza**: North Avenue sector (Restaurant Le Wow, Sushi High Roller, Poké Ball Boutique)
  * 🟣 **Magenta Plaza**: North-West sector (Magenta Pokémon Center, Lysandre Café)
  * 🔵 **Bleu Plaza**: South-West sector (Café Woof, Friseur Furfrou)
  * 🟢 **Vert Plaza**: South-East sector (Café Cyclone, Boutique Couture)
  * 🟡 **Jaune Plaza**: North-East sector (Café Kizuna, Trevor's House)
* **4 Grand Radial Avenues**: Autumnal Avenue, Hibernal Avenue, Vernal Avenue, and Estival Avenue.
* **Concentric Boulevards**: North Boulevard and South Boulevard with landmark telemetry cards.
* **5 Outer Route Gates**: Route 4 (to Santalune City), Route 5 (to Camphrier Town), Route 13 (to Coumarine City / Badlands), Route 14 (to Laverre City), and Route 16 (to Dendemille Town).
* **Dual Map Engine**: Toggle seamlessly between the **Lumiose City Metro Grid** and the **3D Kalos Continental Topology**.

### 2. 📏 The "True-Scale" 3D Holographic Arena (`<TrueScaleArena />`)
* **Mathematical Telemetry**: Direct conversion of PokeAPI physical metrics (decimetres to exact meters) rendered in 3D world space.
* **1.70m (5'7") Human Trainer Reference**: A calibrated holographic human Trainer complete with cap visor, backpack, and laser scale ring.
* **Visual Height & Weight Comparison**: Side-by-side inspection with vertical laser measurement rulers, concentric range discs, and real-time comparative percentage readouts.
* **Camera Perspective Presets**: Instant camera switching between **Overview**, **Trainer POV (1.70m eye-level inspection)**, and **Aerial Tactical View**.

### 3. 🛡️ Tactical Team Builder with Synergy Vulnerability Analyzer
* **6-Member Battle Squad**: Build custom teams from the 72 Kalos indigenous species, Mega Evolutions, and special forms.
* **Instant 1-Click Preset**: `[⚡ Ash's Kalos Squad]` loads Ash Ketchum's official championship team (*Ash-Greninja, Pikachu, Talonflame, Hawlucha, Goodra, Noivern*) with single-click ease.
* **Tactical Synergy Alert System**: Automatically calculates combined elemental vulnerabilities and surfaces visual tactical alerts when $\ge 3$ squad members share a common weakness.
* **4-Slot Move-Set Editor**: Customize individual moves from each specimen's authentic learnset.
* **Full 18-Type Defense Matrix**: Color-coded incoming damage multipliers ($4\times, 2\times, 1\times, 0.5\times, 0.25\times, 0\times$).
* **Cloud & Local Persistence**: Instant local storage for guests, with optional Supabase cloud synchronization for authenticated trainers.

### 4. 📊 Advanced Data Visualization & Competitive Suite
* **Hexagonal Radar Stat Charts (`<HexRadarChart />`)**: Animated SVG radar chart charting HP, Attack, Defense, Sp. Atk, Sp. Def, and Speed with Kalos regional average comparison overlay.
* **18-Type Weakness & Resistance Heatmap (`<TypeHeatmap />`)**: Dynamic defense matrix computing net damage multipliers against all elemental types.
* **Interactive Evolutionary Lineage (`<EvolutionFlowchart />`)**: Branching node flowchart detailing levels, evolutionary stones, friendship thresholds, time of day, and Battle Bond transformations.
* **Competitive Stat Tuner (`<CompetitiveStatCalculator />`)**: Generation 6–9 stat engine calculating actual combat stats based on Effort Values (EVs: 0–252), Individual Values (IVs: 0–31), Level (50 or 100), and all 25 competitive Natures.
* **Multi-Game Lore Archive**: Switch between official Pokédex entries across Pokémon X, Y, Omega Ruby, and Alpha Sapphire.
* **Typo-Tolerant Fuzzy Search**: Intelligent search powered by Levenshtein distance matching species even with typos (e.g., *"charzard"* $\rightarrow$ *Charizard*).
* **Deep BST Slider Filter**: Real-time slider filtering specimens by Base Stat Total ($0 - 780$).

### 5. 🎨 3-Way Dynamic Themes & "Soft Grey" Light Mode
* **Soft Grey & Polished Silver**: Premium slate daylight mode (`#E2E8F0` backdrop with frosted silver glass panels and deep slate navy typography) eliminating harsh white eye fatigue.
* **Deep Kalos Blue**: Signature 9th-Generation holographic theme with glowing cyan accents.
* **Pitch Black**: True AMOLED `#030712` mode for maximum contrast and battery efficiency on OLED displays.
* **Global Shiny Toggle**: Universal toggle switching artwork and sprites to official shiny colorations across the entire platform.

---

## ⚡ Performance & WebGL Optimization

To guarantee a fluid 60 FPS across both desktop and mobile devices despite heavy 3D rendering:

1. **Code-Splitting & Lazy Loading**: Heavy Three.js scenes (`Lumiose3DScene`, `KalosScene`, `TrueScaleArena`, `OrbitControls`) are dynamically imported via `React.lazy` and `Suspense`, isolating Three.js from the initial Pokédex landing bundle.
2. **GPU Pixel Ratio Clamping**: Canvas rendering is clamped via `dpr={[1, 1.5]}` to prevent GPU bottlenecks on high-DPI (Retina/4K) displays.
3. **Single Draw-Call Particles**: Background particle environments use `THREE.InstancedMesh` with matrix updates to render hundreds of particles in a single GPU draw call.
4. **Component Memoization**: Core grid cards and mathematical calculation engines are wrapped with `React.memo`, `useMemo`, and `useCallback` to prevent superfluous re-renders during viewport navigation.

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | `React 19.2` + `Vite 8.1` | Concurrent React architecture, fast HMR, and optimized production bundle |
| **3D & WebGL Engine** | `Three.js` + `@react-three/fiber` + `@react-three/drei` | 3D Lumiose City schematic, Kalos topology, and True-Scale Arena |
| **Animation Physics** | `Framer Motion 12.4` | 3D card tilt physics, page transitions, and smooth modal animations |
| **Styling & Design Tokens**| `Tailwind CSS v4.3` + CSS Custom Properties | Non-hardcoded tokens, glassmorphism, and responsive layouts |
| **Data Engine** | `PokeAPI` + `Axios` | Comprehensive specimen database, audio cries, moves, and evolution trees |
| **Authentication** | `@supabase/supabase-js` | Guest-first architecture with optional cloud team backup |
| **Iconography** | `Lucide React` | High-tech holographic HUD iconography |

---

## 💻 Installation & Local Development

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kanishk3114S/Kalos-Dex.git
   cd Kalos-Dex/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📜 License
This project is open-source under the MIT License. Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak.
