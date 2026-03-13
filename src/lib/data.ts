import { EmsLogo, HealthLogo, PremierLogo, RalLogo, SapsLogo, TransportLogo } from "@/components/icons";
import { Award, BarChart, Car, Handshake, Siren, Users, TrendingUp } from "lucide-react";

export const departments = [
  { name: "Premier's Office", icon: PremierLogo, href: "/dashboard" },
  { name: "SAPS", icon: SapsLogo, href: "/dashboard/saps" },
  { name: "EMS", icon: EmsLogo, href: "/dashboard/ems" },
  { name: "Transport", icon: TransportLogo, href: "/dashboard/transport" },
  { name: "Health", icon: HealthLogo, href: "/dashboard/health" },
  { name: "Roads Agency", icon: RalLogo, href: "/dashboard/ral" },
];

export const incidents = [
    {
        id: "INC001",
        priority: "Critical",
        type: "Crash - Guardian User Down",
        location: "N1 KM45",
        etaPolice: "3m 12s",
        etaAmbulance: "4m 30s",
        video: true,
        coords: "23°57'S 29°27'E",
        assigned: "Constable Mthembu",
        status: "En Route",
        icon: Car
    },
    {
        id: "INC002",
        priority: "Medium",
        type: "Heist - Cash-in-Transit",
        location: "R81 Polokwane",
        etaPolice: "6m 45s",
        etaSecurity: "5m 20s",
        video: true,
        coords: "23°55'S 29°25'E",
        assigned: "Unit 247",
        status: "En Route",
        icon: Siren
    },
    {
        id: "INC003",
        priority: "Low",
        type: "Robbery - Walking Home",
        location: "Polokwane CBD",
        etaPolice: "8m 10s",
        etaSecurity: "N/A",
        video: false,
        coords: "23°54'S 29°27'E",
        assigned: "Unit 102",
        status: "Dispatched",
        icon: Users
    },
];

export const workers = [
  {
    id: "Unit 247",
    department: "Ambulance",
    location: "Polokwane",
    status: "Standby Ready",
    score: 98,
    statusColor: "bg-green-500",
  },
  {
    id: "Constable Mthembu",
    department: "N1 Patrol",
    status: "En Route",
    eta: "2m 45s",
    score: 85,
    statusColor: "bg-green-500",
  },
  {
    id: "Unit 319",
    department: "Fire",
    location: "Tzaneen",
    status: "8min away",
    score: 72,
    statusColor: "bg-yellow-500",
  },
  {
    id: "Unit 105",
    department: "Police",
    status: "Offline 45min",
    score: -25,
    statusColor: "bg-red-500",
  },
  {
    id: "ER24-04",
    department: "Netcare ER24",
    location: "Mokopane",
    status: "Standby Ready",
    score: 95,
    statusColor: "bg-green-500",
  },
];

export const kpiData = [
    { metric: "Response Time", thisWeek: "4m 32s", target: "<5min", status: "success", trend: "↓12%", trendStatus: "success" },
    { metric: "Worker Compliance", thisWeek: "87%", target: ">85%", status: "success", trend: "↑3%", trendStatus: "success" },
    { metric: "False Alerts", thisWeek: "1.8%", target: "<2%", status: "success", trend: "↓0.4%", trendStatus: "success" },
    { metric: "Lives Saved", thisWeek: "17", target: "15/wk", status: "success", trend: "↑40%", trendStatus: "success" },
    { metric: "Cost Savings", thisWeek: "R1.2M", target: "R4M/mo", status: "warning", trend: "New", trendStatus: "neutral" },
    { metric: "Fatality Reduction", thisWeek: "-41%", target: "-40%", status: "success", trend: "↓5%", trendStatus: "success" },
];

export const executiveKpis = [
    { title: "Response Time", value: "4m 32s", target: "< 5min", trend: "-12%", trendDirection: "down", status: "success" },
    { title: "Fatality Reduction", value: "-41%", target: "-40%", trend: "-5%", trendDirection: "down", status: "success" },
    { title: "Worker Standby", value: "87%", target: "> 85%", trend: "+3%", trendDirection: "up", status: "success" },
    { title: "Cost Savings", value: "R1.2M", target: "R4M/mo", trend: "+15%", trendDirection: "up", status: "warning" }
];


export const departmentIntegrationData = {
  saps: {
    title: "SAPS Limpopo Command",
    icon: SapsLogo,
    stats: [
      { label: "Active Dispatches", value: "12/25 units", icon: Siren },
      { label: "Heist Prediction", value: "R101 Junction 14 (18:00-20:00) - 78% probability", icon: TrendingUp },
      { label: "Guardian Arrests", value: "7 this week (facial recognition matches)", icon: Award },
    ]
  },
  health: {
    title: "Health/EMS Coordination",
    icon: HealthLogo,
    stats: [
      { label: "Ambulance Utilisation", value: "73% (14/19 units active)", icon: BarChart },
      { label: "Hospital Bed Status", value: "Polokwane 87% full, Tzaneen 42% full", icon: Users },
      { label: "Trauma Cases Today", value: "23 (↓17% vs last week)", icon: TrendingUp },
    ]
  },
  transport: {
    title: "Transport/SANRAL ITS",
    icon: TransportLogo,
    stats: [
      { label: "LED Billboards Active", value: "47/50 (N1 warnings live)", icon: Car },
      { label: "Traffic Impact", value: "N1 Northbound -15km jam (Clearance ETA 12min)", icon: BarChart },
      { label: "Road Sensors", value: "1,247 active / 1,500 total", icon: BarChart },
    ]
  },
  private: {
    title: "Private Security Partners",
    icon: Handshake,
    stats: [
      { label: "Fidelity Guards", value: "8/12 units dispatched", icon: Users },
      { label: "Netcare ER24", value: "6 active cases", icon: Siren },
      { label: "Life Healthcare", value: "3 receiving Guardian patients", icon: HealthLogo },
    ]
  },
};


export const predictiveAIInput = {
  currentIncidents: [
    { id: "INC001", type: "Crash", location: "N1 KM45", severity: "Critical", status: "Active", etaPolice: "3m" },
    { id: "INC002", type: "Heist", location: "R81 Polokwane", severity: "Medium", status: "Active", etaPolice: "7m" }
  ],
  historicalDataSummary: "R81 Polokwane frequently experiences cash heists between 18:00-20:00 on weekdays. N1 Rural has drunk driving peaks between 22:00-02:00 on weekends.",
  externalFeedsSummary: "Heavy traffic congestion on N1 Northbound. Rainy weather expected in Polokwane area tonight."
};

export const communicationAIInput = {
    incidentType: "Crash",
    incidentLocation: "N1 KM45",
    incidentOutcome: "cleared 20min ahead of schedule",
    guardianInvolvement: "Guardian success, traffic rerouted automatically",
    keyAchievements: ["17 lives saved this week", "accident cost reduction: R23M/year projected"],
    additionalDetails: "No fatalities reported."
};
