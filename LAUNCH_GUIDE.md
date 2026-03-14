# LPISTH Premier Command Centre Dashboard

A production-ready, ultra-professional React web dashboard for the Office of the Premier and all 6 departments in the Limpopo Provincial Intelligent Safety and Traffic Hub.

## 🚀 Quick Start (< 3 Hours to Launch)

### Step 1: Install Dependencies
```bash
cd c:\Users\202396130\Provincial-Safety-Dashboard
npm install
```

### Step 2: Configure Firebase
1. Copy `.env.local.example` to `.env.local`
2. Add your Firebase project credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Run Development Server
```bash
npm run dev
```

Navigate to `http://localhost:5173` in your browser.

### Step 4: Login with Demo Credentials
- **Email:** premier@lipsth.gov.za
- **Password:** demo123456

## 📊 Dashboard Features

### Core Sections
- **Dashboard Overview** - Real-time KPI cards with live metrics (police response time, ambulance response, false alert rate, service delivery score)
- **Provincial Smart Map** - Interactive Leaflet map with crime hotspots, traffic congestion, hospital capacity, power grid, infrastructure status
- **Live Incident Feed** - Auto-refreshing stream of SOS calls, voice commands, family alerts, medical emergencies with 20-second video thumbnails
- **Performance Metrics** - Detailed analytics with 24-hour response trend charts and incident distribution by department
- **Smart Traffic Control** - Traffic light management and emergency vehicle routing
- **AI Predictive Analytics** - Machine learning forecasts for crime hotspots, infrastructure failures, disease outbreaks, weather alerts
- **Settings & Reports** - PDF/CSV export, system preferences, audit logs

### Professional UI/UX
- **Glassmorphic Cards** - Frosted glass effect with subtle inner glow (rgba(10,15,10,0.68))
- **Advanced Animations** - Framer Motion with spring physics, gravity-drop modals, staggered transitions
- **Multi-lingual Support** - English, Sepedi, Setswana, Xitsonga, Afrikaans, isiZulu
- **Real-time Updates** - Firebase Firestore listeners for instant data refresh
- **Role-Based Access** - Premier, Minister, Police Commander, EMS Director, Traffic Chief, Administrator roles
- **National Risk Index Gauge** - Color-coded (green/yellow/red) displayed in top bar

## 🔐 Security & RBAC

All access is controlled via Firebase Auth with custom claims:
- **Premier/National Executive** - Full access to all sections and data
- **Minister** - Departmental oversight + metrics
- **Commander (Police)** - SAPS + crime focus + live incidents
- **Director (EMS)** - Health + ambulance focus + medical metrics
- **Chief (Traffic)** - Traffic control + smart lights + congestion data
- **Administrator** - Settings, reports, user management
- **Analyst/Guest** - Read-only metrics and predictions

Database-level security enforced via Firestore rules (see `/firestore.rules`).

## 🎨 Component Architecture

```
src/
├── app/
│   ├── App.tsx (main router)
│   └── Dashboard.tsx (layout wrapper)
├── components/
│   └── dashboard/
│       ├── TopBar.tsx (real-time clock, risk index, language switcher)
│       ├── Sidebar2.tsx (role-based navigation menu)
│       ├── MainContent.tsx (section router)
│       ├── KPISection.tsx (metrics + charts)
│       ├── SmartMap.tsx (leaflet map with layers)
│       ├── LiveIncidents.tsx (incident feed stream)
│       ├── PredictiveAlerts.tsx (AI predictions)
│       └── AIAssistant.tsx (natural language chat)
├── pages/
│   ├── LoginPage.tsx
│   └── UnauthorizedPage.tsx
├── hooks/
│   ├── useAuth.ts (Firebase authentication context)
│   └── useRole.ts (role info + permission checks)
└── lib/
    ├── firebase.ts (Firebase SDK init)
    ├── rbac.ts (role definitions + permissions matrix)
    └── audit.ts (audit logging utilities)
```

## 📦 Tech Stack

- **Frontend:** React 19.2.1 + Next.js 15.5.9
- **Styling:** Tailwind CSS + Framer Motion animations
- **Charts:** Recharts (line, bar, pie charts)
- **Maps:** Leaflet + React-Leaflet
- **Tables:** TanStack React Table
- **Icons:** Lucide React
- **Backend:** Firebase (Auth, Firestore, Storage, Cloud Functions)
- **Language:** TypeScript (strict mode)

## 🔄 Real-Time Data Integration

The dashboard listens to Firestore collections in real-time:
- `incidents` - SOS calls, voice commands, family alerts
- `videos` - 20-second dual-camera clips with AI severity scores
- `responders` - Police, EMS, Traffic units with live ETAs
- `kpis` - Response times, compliance metrics
- `hospitalCapacity` - Bed availability + occupancy rates
- `trafficData` - Congestion levels, green light timings
- `infrastructure` - Power grid, water systems, bridges, roads
- `predictions` - AI-generated risk forecasts

All data updates automatically across the dashboard via Firebase onSnapshot listeners.

## 🚨 Emergency Features

- **SOS Hold Triggering** - 5-second countdown with voice commands ("send Police", "send Ambulance")
- **Emergency Override** - Premier/Minister can temporarily elevate any user to bypass role restrictions
- **Vicinity Alerts** - Only incidents within 8km of citizen location shown
- **Guardian Network** - Nearby community helpers accept help requests
- **Multi-Agency Unified View** - All responders visible on single map

## 📱 Mobile Responsive

- **Desktop** (4-column grid) - Full dashboard with all charts and maps
- **Tablet** (2-column grid) - Stacked KPI cards, optimized charts
- **Mobile** (1-column) - Collapsible sidebar, simplified layout

## 🧪 Testing

### Demo Accounts (Create in Firebase Console)
```
Premier:          premier@lipsth.gov.za     (demo123456)
Minister:         minister@lipsth.gov.za   (demo123456)
Police Commander: commander@saps.gov.za    (demo123456)
EMS Director:     director@health.gov.za   (demo123456)
Traffic Chief:    chief@transport.gov.za   (demo123456)
Admin:            admin@lipsth.gov.za      (demo123456)
```

### Assign Roles (via Cloud Function)
```typescript
// Call this from your admin console
await httpsCallable(functions, 'setUserRole')({
  uid: 'user-id',
  role: 'premier',
  department: 'office_of_premier'
})
```

## 🐛 Troubleshooting

**"Cannot find module 'firebase'"**
→ Run `npm install`

**"Firestore connection refused"**
→ Check Firebase project is created and credentials are in `.env.local`

**"Unauthorized" error on login**
→ Ensure test user is created in Firebase Console → Authentication

**Map not loading**
→ Verify Leaflet CSS is imported (should be automatic in SmartMap.tsx)

**Role-based sections not visible**
→ Check Firestore rules (firestore.rules) are deployed: `firebase deploy --only firestore:rules`

## 📊 Performance Tips

- Lazy load images using Leaflet tile providers
- Use Firestore pagination for large incident streams (limit(20))
- Cache user roles in localStorage after first load
- Debounce map zoom/pan events (Framer Motion handles this)
- Use `React.memo()` for chart components if rendering >100 incidents

## 🌍 Deployment

### Firebase Hosting
```bash
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel (Recommended for Next.js)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 Support & Documentation

- Full RBAC guide: See `RBAC_DEPLOYMENT_GUIDE.md`
- Integration patterns: See `RBAC_INTEGRATION_GUIDE.md`
- Migration guide: See `MIGRATION_GUIDE.md`
- Firestore rules: See `firestore.rules`
- Cloud Functions: See `functions/index.ts`

---

**Build Status:** ✅ Production Ready  
**Last Updated:** March 14, 2026  
**Version:** 1.0.0  

The Premier Command Centre is ready for deployment to pilot sites across Limpopo Province. All components are fully integrated with Firebase real-time listeners and role-based security rules.
