export const C = {
    bg: "#050E1C", navy: "#091628", card: "rgba(255,255,255,0.035)",
    border: "rgb(107 97 97 / 26%)", teal: "#0BB5A0", tealL: "#14D4BC",
    gold: "#D4A843", goldL: "#F0C96B", slate: "#4A6080", slateL: "#7A95B0",
    green: "#2ECC8A", red: "#E05252", purple: "#8B5CF6", blue: "#3B82F6",
    orange: "#F97316", white: "#FFFFFF", black: "#000000",
    zoom: "#2D8CFF", gmeet: "#00897B", teams: "#5B5EA6",
};

export const HOSPITALS = [];
export const SPECIALTIES = ["All", "Cardiology", "Orthopedics", "Oncology", "Neurology", "Dental", "Cosmetic"];
export const PACKAGES = [
    { id: 1, name: "Knee Replacement Package", hospital: "Bangkok International", flag: "🇹🇭", price: "$8,900", includes: ["Surgery", "4-night stay", "Pre-op tests", "Physio sessions (5)", "Airport transfer", "Dedicated coordinator"], savings: "75%", duration: "7 days", category: "Orthopedics" },
    { id: 2, name: "IVF Fertility Package", hospital: "Prince Court", flag: "🇲🇾", price: "$4,500", includes: ["Full IVF cycle", "All medications", "Monitoring scans", "Embryo transfer", "3-night hotel", "Visa assistance"], savings: "70%", duration: "14 days", category: "Fertility" },
    { id: 3, name: "Smile Makeover Package", hospital: "Medicana", flag: "🇹🇷", price: "$3,200", includes: ["8 veneers", "Teeth whitening", "2 nights hotel", "City tour", "Coordinator"], savings: "82%", duration: "5 days", category: "Dental" },
    { id: 4, name: "Cardiac Bypass Package", hospital: "Apollo Hospitals", flag: "🇮🇳", price: "$9,500", includes: ["CABG surgery", "ICU care", "10-night stay", "Post-op rehab", "Dedicated nurse"], savings: "80%", duration: "15 days", category: "Cardiology" },
];
export const DOCTORS = [];
export const JOURNEY_STEPS = [];
export const AGENTS = [];
export const LANGUAGES = [];
export const PLATFORMS = [];
export const NAV_PAGES = [
    { key: "", label: "Home", icon: "🏠" },
    { key: "search", label: "Hospitals", icon: "🏥" },
    { key: "packages", label: "Packages", icon: "📦" },
];
export const fmtDate = (date) => new Date(date).toLocaleDateString();
