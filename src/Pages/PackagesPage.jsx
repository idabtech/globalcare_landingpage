import React, { useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { C, HOSPITALS, SPECIALTIES, PACKAGES, DOCTORS, JOURNEY_STEPS, AGENTS, LANGUAGES, PLATFORMS, NAV_PAGES, fmtDate } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionTitle from '../ui/SectionTitle';

const PackagesPage = () => {
    const [pkgFilter, setPkgFilter] = useState("All");
    const filtered = pkgFilter === "All" ? PACKAGES : PACKAGES.filter(p => p.category === pkgFilter);
    const categories = ["All", ...new Set(PACKAGES.map(p => p.category))];

    return (
        <div style={{ paddingTop: 80, padding: "80px 48px", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <SectionTitle title="Treatment Packages" sub="All-inclusive healthcare bundles for a smooth medical journey" />

                <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
                    {categories.map(c => {
                        return (
                            <button key={c} onClick={() => setPkgFilter(c)} style={{
                                padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                                background: pkgFilter === c ? `linear-gradient(135deg,${C.teal},${C.tealL})` : C.card,
                                color: pkgFilter === c ? C.white : C.slateL,
                                border: `1px solid ${pkgFilter === c ? "transparent" : C.border}`,
                                transition: "all 0.2s"
                            }}>{c}</button>
                        )
                    })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
                    {filtered.map(p => (
                        <Card key={p.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontSize: 24 }}>{p.flag}</span>
                                    <Badge color={C.gold}>{p.category}</Badge>
                                </div>
                                <div style={{ color: C.tealL, fontWeight: 900, fontSize: 22 }}>{p.price}</div>
                            </div>
                            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 12 }}>{p.name}</h3>
                            <p style={{ color: C.slateL, fontSize: 13, marginBottom: 16 }}>at {p.hospital}</p>
                            <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                                <div style={{ fontSize: 11, fontWeight: 800, color: C.slateL, marginBottom: 10, textTransform: "uppercase" }}>Includes:</div>
                                {p.includes.map(inc => <div key={inc} style={{ fontSize: 13, color: C.slateL, marginBottom: 6, display: "flex", gap: 8 }}>
                                    <span style={{ color: C.tealL }}>✓</span> {inc}
                                </div>)}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                <div style={{ fontSize: 13, color: C.slateL }}>⏱ Duration: <span style={{ color: C.white, fontWeight: 700 }}>{p.duration}</span></div>
                                <div style={{ background: "rgba(34,201,122,0.12)", color: C.green, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>Save {p.savings}</div>
                            </div>
                            <Btn style={{ width: "100%", padding: 12 }} onClick={() => { setSelectedHospital(HOSPITALS.find(h => h.name === p.hospital) || HOSPITALS[0]); nav("details"); }}>View Full Package & Hospital</Btn>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default PackagesPage;
