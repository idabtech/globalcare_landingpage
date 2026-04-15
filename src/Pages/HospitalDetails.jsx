import React from 'react';
import { C, HOSPITALS } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AppContext } from '../context/AppContext';

const HospitalDetails = () => {
    const { selectedHospital, nav, showNotif, hospitalTab, setHospitalTab } = React.useContext(AppContext);
    const h = selectedHospital || HOSPITALS[0];
    console.log(h)
    return (
        <div style={{ paddingTop: 10, minHeight: "100vh" }}>
            <div style={{ background: `linear-gradient(135deg,${C.navy},${C.bg})`, padding: "40px 48px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <button onClick={() => nav("search")} style={{ background: "none", border: "none", color: C.slateL, cursor: "pointer", marginBottom: 20 }}>← Back to Search</button>
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                        <div style={{ width: 80, height: 80, background: "rgba(11,181,160,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🏥</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Badge color={C.gold}>{h.accreditation} Certified</Badge><Badge color={C.green}>Save {h.savings}</Badge></div>
                            <h1 style={{ fontSize: 28, fontWeight: 800 }}>{h.name}</h1>
                            <p style={{ color: C.slateL }}>{h.city}, {h.country} · {h.procedures}+ Annual Procedures</p>
                        </div>
                        <Btn onClick={() => nav("scheduler")} style={{ padding: "12px 24px" }}>Request Quote</Btn>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 32 }}>
                        {["overview", "specialties", "pricing", "reviews"].map(t => {
                            return (
                                <button key={t} onClick={() => setHospitalTab(t)} style={{ padding: "10px 20px", borderRadius: "8px 8px 0 0", cursor: "pointer", background: hospitalTab === t ? C.bg : "transparent", color: hospitalTab === t ? C.tealL : C.slateL, border: hospitalTab === t ? `1px solid ${C.border}` : "none", borderBottom: "none", textTransform: "capitalize" }}>{t}</button>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div style={{ padding: "32px 48px", maxWidth: 1100, margin: "0 auto" }}>
                {hospitalTab === "overview" && (
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>About the Institution</h3>
                            <p style={{ color: C.slateL, lineHeight: 1.8, marginBottom: 24 }}>{h.name} is a global leader in healthcare excellence, serving over {h.intlPct} international patients. With a success rate of {h.outcomes}%, the hospital combines cutting-edge technology with compassionate care.</p>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Key Facilities</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {["International Patient Hub", "24/7 Translation", "Telehealth Support", "Luxury Wellness Suites"].map(f => <div key={f} style={{ color: C.slateL, fontSize: 14 }}>✓ {f}</div>)}
                            </div>
                        </div>
                        <Card>
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Hospital Facts</h3>
                            {[["Founded", h.founded], ["Beds", h.total_beds], ["Response", h.responseTime]].map(([k, v]) => (
                                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}><span style={{ color: C.slateL }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span></div>
                            ))}
                            <Btn style={{ width: "100%", marginTop: 20 }} onClick={() => showNotif("Consultation requested")}>Book Consultation</Btn>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
export default HospitalDetails;
