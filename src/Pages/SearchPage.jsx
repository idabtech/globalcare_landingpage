import React, { useState, useEffect } from 'react';
import { C, HOSPITALS, SPECIALTIES, PACKAGES, DOCTORS, JOURNEY_STEPS, AGENTS, LANGUAGES, PLATFORMS, NAV_PAGES, fmtDate } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionTitle from '../ui/SectionTitle';
import { hospitalService } from '../service/hospital.service';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
    const { setSelectedHospital, searchQuery, setSearchQuery, selectedSpecialty, setSelectedSpecialty } = React.useContext(AppContext);
    const nav = useNavigate();
    const [hospitalData, setHospitalData] = useState([]);
    const [loading, setLoading] = useState(true);

    // const filtered = hospitalData.filter(h => {
    //     const q = searchQuery.toLowerCase();
    //     return (!q || h.name.toLowerCase().includes(q) || h.country.toLowerCase().includes(q)) && (selectedSpecialty === "All" || h.specialty.includes(selectedSpecialty));
    // });
    const filtered = (hospitalData || []).filter(h => {
        const q = (searchQuery || "").toLowerCase();

        return (
            (!q ||
                h.name?.toLowerCase().includes(q) ||
                h.country?.toLowerCase().includes(q)
            ) &&
            (selectedSpecialty === "All" ||
                h.specialties?.includes(selectedSpecialty)
            )
        );
    });
    const GethospitalData = async () => {
        const data = await hospitalService.getHospitals();
        const normalized = (data.hospitals || []).map(h => {
            let specialties = h.specialties;
            if (typeof specialties === "string") {
                try {
                    specialties = JSON.parse(specialties);
                } catch {
                    specialties = [specialties];
                }
            }
            // Ensure it's an array and remove duplicates
            const specArray = Array.isArray(specialties) ? specialties : [specialties];
            return {
                ...h,
                specialties: [...new Set(specArray.filter(Boolean))] // filter out empty values
            };
        });

        setHospitalData(normalized);
        setLoading(false);
    }

    useEffect(() => {
        GethospitalData();
    }, []);

    const allSpecialties = React.useMemo(() => {
        const uniqueSpecialties = Array.from(
            new Set(hospitalData.flatMap(h => h.specialties || []))
        );
        return ["All", ...uniqueSpecialties];
    }, [hospitalData]);

    return (
        <div style={{ paddingTop: 80, padding: "80px 48px", minHeight: "100vh" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Find Your Hospital</h2>
                    <p style={{ color: C.slateL }}>Browse {HOSPITALS.length} world-class facilities</p>
                </div>
                <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="🔍 Search hospital, country, specialty..." style={{ flex: 1, minWidth: 260, padding: "12px 18px", borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, color: C.white, fontSize: 14, outline: "none" }} />
                    <select style={{ padding: "0 18px", borderRadius: 12, background: C.navy, border: `1px solid ${C.border}`, color: C.white }}>
                        <option>All Regions</option>{["Thailand", "India", "Turkey", "Singapore"].map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                    {allSpecialties.map(s => {
                        return (
                            <button key={s} onClick={() => setSelectedSpecialty(s)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", background: selectedSpecialty === s ? `linear-gradient(135deg,${C.teal},${C.tealL})` : C.card, color: selectedSpecialty === s ? C.white : C.slateL, border: `1px solid ${selectedSpecialty === s ? "transparent" : C.border}` }}>{s}</button>
                        )
                    })}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))", gap: 20 }}>
                    {filtered.length === 0 ? (
                        <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: C.slateL, fontSize: 16 }}>
                            Hospital data is not found
                        </div>
                    ) : (filtered.map(h => (
                        <Card key={h.id} style={{ transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = C.tealL}>
                            {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                <div><span style={{ fontSize: 24 }}>{h.flag}</span> <Badge color={C.gold}>{h.accreditation}</Badge></div>
                                <div style={{ background: "rgba(46,204,138,0.12)", color: C.green, padding: "4px 10px", borderRadius: 8, fontSize: 12, fontWeight: 800 }}>Save {h.savings}</div>
                            </div> */}
                            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>{h.name}</h3>
                            <p style={{ color: C.slateL, fontSize: 13, marginBottom: 12 }}>📍 {h.city}, {h.country}</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                {h?.specialties?.map(s => <span key={s} style={{ background: "rgba(11,181,160,0.1)", color: C.tealL, padding: "3px 8px", borderRadius: 6, fontSize: 11 }}>{s}</span>)}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                                <div><div style={{ color: C.goldL, fontWeight: 700, fontSize: 14 }}>⭐ {h.rating}</div><div style={{ fontSize: 11, color: C.slateL }}>{h.reviews} reviews</div></div>
                                <Btn onClick={() => { setSelectedHospital(h); nav("/details"); }}>View Details</Btn>
                            </div>
                        </Card>
                    )))}
                </div>
            </div>
        </div>
    );
}
export default SearchPage;
