# **App Name**: Guardian Command Center

## Core Features:

- Secure Access & Authentication: Implement multi-level access controls, including biometric and 2FA authentication, for Premier, HODs, District Commanders, and Operators. Ensure role-based views and an audit trail for accountability.
- Live Incident Command & Map: Provide a real-time, interactive heatmap of Limpopo displaying active incidents (crashes, heists, etc.) with location details, severity, and estimated arrival times for responders. Enable one-click command actions like dispatching or rerouting.
- Emergency Worker Accountability: Display live GPS tracking and readiness scores for emergency workers. Utilize a proof-of-work algorithm to assess compliance and an automated tool to suggest dispatching the nearest ready units to incidents.
- Predictive Risk & Alert Tool: Utilize AI to analyze real-time data from sensors and historical patterns to identify high-risk areas or predict potential incidents, providing early warning alerts and suggested preemptive actions to the Premier.
- Executive KPI Dashboard: Present a clear, real-time dashboard with key performance indicators for the Premier, such as response times, fatality reduction, worker compliance, and cost savings.
- Departmental Integration Overview: Integrate and display critical operational data from various government departments like SAPS, Health/EMS, and Transport, offering an integrated view of provincial safety and resource allocation.

## Style Guidelines:

- Dark scheme with a rich background of deep grey-blue (HSL: 195, 15%, 8%) converted to RGB hex: #11171A.
- Primary action color: vibrant neon blue (HSL: 195, 100%, 50%) converted to RGB hex: #00BFFF, for live data, active elements, and interactive components, ensuring high contrast.
- Secondary accent color: Limpopo-inspired deep green (HSL: 165, 60%, 25%) converted to RGB hex: #196049, used for significant indicators and governmental branding. Achievements and PoW rewards are highlighted with a dedicated gold color.
- All cards will be solid white with 2px solid grey borders to ensure high contrast against the dark background.
- Headlines and prominent text will use 'Space Grotesk' (sans-serif) for a modern, tech-centric feel. Body text and data tables will use 'Inter' (sans-serif) for readability and neutrality in data presentation.
- Utilize Lucide React icons throughout the interface for clarity and consistency. Departmental items will feature 40px official emblems, and Lottie animations will be solid-line only, without gradients, for elements like heartbeats or satellite pulses.
- Fixed top bar for global navigation and Premier tools, with a collapsible left sidebar (drawer on mobile) for department selection. Main content area uses a responsive Tailwind grid with modular, 16px radius cards, designed for desktop and adaptable for smaller screens.
- All interactive elements will use Framer Motion for physics-based animations: spring transitions (stiffness 150-220, damping 15-25) for card expansions and general interactions; hover scales (1.05x) with subtle neon glow box-shadow; button presses with quick scale (0.92x then 1.0x); gravity-drop for modals/alerts; friction slowdown for progress bars and gauges. Staggered list animations (0.08s delay) for tables and KPI cards. Ripple effects on all interactive elements. Pulsing elements (scale 1.0x to 1.06x with easeInOut loop) for active states. Page transitions are fade-through and shared-axis horizontal slide. Supports `prefers-reduced-motion` for accessibility.