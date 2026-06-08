import React from 'react';
import { C, HOSPITALS } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const HospitalDetails = () => {
    const { selectedHospital, showNotif, hospitalTab, setHospitalTab } = React.useContext(AppContext);
    const h = selectedHospital || HOSPITALS[0];
    const nav = useNavigate();

    return (
        <div style={{ paddingTop: 10, minHeight: "100vh" }}>
            <div style={{ padding: "40px 48px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <button onClick={() => nav("/search")} style={{ background: "none", border: "none", color: C.slateL, cursor: "pointer", marginBottom: 20 }}>← Back to Search</button>
                    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                        <div style={{ width: 80, height: 80, background: "rgba(11,181,160,0.15)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🏥</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><Badge color={C.gold}>{h.accreditation} Certified</Badge><Badge color={C.green}>Save {h.savings}</Badge></div>
                            <h1 style={{ fontSize: 28, fontWeight: 800 }}>{h.name}</h1>
                            <p style={{ color: C.slateL }}>{h.city}, {h.country}</p>
                        </div>
                        <Btn onClick={() => window.open(import.meta.env.VITE_ADMIN_URL, "_blank")} style={{ padding: "12px 24px" }}>Request Quote</Btn>
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 32 }}>
                        {["overview", "doctors", "specialties"].map(t => {
                            return (
                                <button key={t} onClick={() => setHospitalTab(t)} style={{ padding: "10px 20px", borderRadius: "8px 8px 0 0", cursor: "pointer", background: hospitalTab === t ? C.white : "transparent", color: hospitalTab === t ? C.tealL : C.slateL, border: hospitalTab === t ? `1px solid ${C.border}` : "none", borderBottom: "none", textTransform: "capitalize" }}>{t}</button>
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
                            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                                Hospital Facts
                            </h3>

                            {[
                                ["Founded", h.created_at ? new Date(h.created_at).getFullYear() : "-"],
                                ["Beds", h.total_beds],
                                ["Doctors", h.doctors?.length || h.doctor_count || 0]
                            ].map(([k, v]) => (
                                <div
                                    key={k}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px 0",
                                        borderBottom: `1px solid ${C.border}`,
                                        fontSize: 13
                                    }}
                                >
                                    <span style={{ color: C.slateL }}>{k}</span>
                                    <span style={{ fontWeight: 600 }}>{v}</span>
                                </div>
                            ))}

                            <Btn
                                style={{ width: "100%", marginTop: 20 }}
                                onClick={() => showNotif("Consultation requested")}
                            >
                                Book Consultation
                            </Btn>
                        </Card>
                    </div>
                )}
                {hospitalTab === "doctors" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                        {h.doctors && h.doctors.length > 0 ? (
                            h.doctors.map(d => (
                                <Card key={d.id}>
                                    <div style={{ fontSize: 40, marginBottom: 10 }}>👨‍⚕️</div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{d.name}</h3>
                                    <p style={{ color: C.tealL, fontWeight: 600, fontSize: 14 }}>{d.specialization}</p>
                                    <div style={{ marginTop: 12, fontSize: 13, color: C.slateL }}>
                                        <p style={{ marginBottom: 4 }}>Experience: {Math.abs(d.experience_yrs)} years</p>
                                        <p>Consultation Fee: ${d.consultation_fee}</p>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div style={{ color: C.slateL, gridColumn: "1/-1" }}>No doctors listed for this hospital.</div>
                        )}
                    </div>
                )}
                {hospitalTab === "specialties" && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                        {h.specialties && Array.isArray(h.specialties) && h.specialties.length > 0 ? (
                            h.specialties.map((s, idx) => (
                                <Card key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{ width: 48, height: 48, background: "rgba(11,181,160,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: C.tealL }}>⚕️</div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{s}</h3>
                                </Card>
                            ))
                        ) : (
                            <div style={{ color: C.slateL, gridColumn: "1/-1" }}>No specialties listed for this hospital.</div>
                        )}
                    </div>
                )}
                {/* {hospitalTab === "pricing" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <Card>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Pricing & Packages</h3>
                            <div style={{ display: "grid", gap: 12 }}>
                                {["General Consultation - $50 - $100", "Specialist Consultation - $100 - $200", "Standard Room - $200/day", "ICU - $800/day"].map((p, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i === 3 ? "none" : `1px solid ${C.border}`, color: C.slateL }}>
                                        <span>{p.split(" - ")[0]}</span>
                                        <span style={{ fontWeight: 600, color: C.white }}>{p.split(" - ").slice(1).join(" - ")}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 24, background: "rgba(11,181,160,0.1)", padding: 16, borderRadius: 8, color: C.tealL, fontSize: 14 }}>
                                * Prices are estimates and may vary based on exact treatment plan and duration.
                            </div>
                        </Card>
                    </div>
                )} */}
                {/* {hospitalTab === "reviews" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        {h.rating ? (
                            <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 12 }}>
                                <div style={{ fontSize: 48, fontWeight: 800, color: C.goldL }}>{h.rating}</div>
                                <div>
                                    <div style={{ color: C.goldL, fontSize: 20, marginBottom: 4 }}>{"★".repeat(Math.round(h.rating)) + "☆".repeat(5 - Math.round(h.rating))}</div>
                                    <div style={{ color: C.slateL }}>Based on {h.reviews || h.review_count || 0} reviews</div>
                                </div>
                            </div>
                        ) : null}
                        {[1, 2, 3].map((r) => (
                            <Card key={r}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div style={{ fontWeight: 700 }}>Patient {r}</div>
                                    <div style={{ color: C.goldL }}>★★★★★</div>
                                </div>
                                <p style={{ color: C.slateL, fontSize: 14, lineHeight: 1.6 }}>"Excellent facilities and very accommodating staff. The entire process from consultation to treatment was handled professionally."</p>
                            </Card>
                        ))}
                    </div>
                )} */}
            </div>
        </div>
    );
}
export default HospitalDetails;
