import React, { useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { C, HOSPITALS, SPECIALTIES, PACKAGES, DOCTORS, JOURNEY_STEPS, AGENTS, LANGUAGES, PLATFORMS, NAV_PAGES, fmtDate } from '../constants/data';
import Btn from '../ui/Btn';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import SectionTitle from '../ui/SectionTitle';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const { page, setPage, selectedHospital, setSelectedHospital, compareList, setCompareList, searchQuery, setSearchQuery, selectedSpecialty, setSelectedSpecialty, notification, setNotification, patientTab, setPatientTab, patientApptsView, setPatientApptsView, patientTravelView, setPatientTravelView, patientPaymentsView, setPatientPaymentsView, lang, setLang, chatOpen, setChatOpen, chatMessages, setChatMessages, chatInput, setChatInput, heroVisible, setHeroVisible, hospitalTab, setHospitalTab, hoveredNav, setHoveredNav, sessions, setSessions, schedView, setSchedView, schedStep, setSchedStep, selDoc, setSelDoc, selPlat, setSelPlat, selDate, setSelDate, selTime, setSelTime, calYear, setCalYear, calMonth, setCalMonth, calView, setCalView, calSelDate, setCalSelDate, showNotif, toggleCompare } = React.useContext(AppContext);
    const nav = useNavigate();
    return (
        <div>
            {/* Hero */}
            <div style={{
                minHeight: "100vh", display: "flex", alignItems: "center",
                background: `radial-gradient(ellipse at 20% 50%, rgba(13,155,138,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(212,168,67,0.1) 0%, transparent 50%), ${C.bg}`,
                position: "relative", overflow: "hidden", padding: "60px 48px"
            }}>
                {/* Grid lines */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(13,155,138,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(13,155,138,0.05) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

                <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
                        <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.8s ease" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(13,155,138,0.15)", border: `1px solid rgba(13,155,138,0.3)`, borderRadius: 20, padding: "6px 16px", marginBottom: 28 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.tealL, display: "inline-block" }} />
                                <span style={{ fontSize: 13, color: C.tealL, fontWeight: 500 }}>340+ Accredited Hospitals Worldwide</span>
                            </div>
                            <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.2, marginBottom: 24, letterSpacing: -2 }}>
                                World-Class Care,<br />
                                <span style={{ background: `linear-gradient(90deg, ${C.tealL}, ${C.goldL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                    Global Access
                                </span>
                            </h1>
                            <p style={{ fontSize: 18, color: C.slateL, lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
                                Connect with JCI-accredited hospitals in 68 countries. Save up to 80% on medical procedures without compromising on quality.
                            </p>
                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                <Btn onClick={() => nav("search")} style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>
                                    Find a Hospital →
                                </Btn>
                                <Btn onClick={() => nav("patient")} variant="ghost" style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }}>
                                    Patient Portal
                                </Btn>
                            </div>
                            <div style={{ display: "flex", gap: 32, marginTop: 48 }}>
                                {[["1M+", "Patients Served"], ["68", "Countries"], ["80%", "Avg. Savings"]].map(([v, l]) => (
                                    <div key={l}>
                                        <div style={{ fontSize: 28, fontWeight: 800, color: C.tealL }}>{v}</div>
                                        <div style={{ fontSize: 13, color: C.slateL }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hero Card */}
                        <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateX(0)" : "translateX(30px)", transition: "all 0.8s ease 0.2s" }}>
                            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, backdropFilter: "blur(20px)" }}>
                                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, color: C.slateL }}>🌏 Popular Destinations</div>
                                {[
                                    { flag: "🇹🇭", country: "Thailand", city: "Bangkok", specialties: "Cardiology, Orthopedics, Dental", savings: "70%" },
                                    { flag: "🇮🇳", country: "India", city: "Chennai, Mumbai", specialties: "Oncology, Neurology", savings: "80%" },
                                    { flag: "🇹🇷", country: "Turkey", city: "Istanbul", specialties: "Hair, Dental, Cosmetic", savings: "75%" },
                                    { flag: "🇸🇬", country: "Singapore", city: "Singapore", specialties: "Cardiology, Cancer", savings: "45%" },
                                ].map(d => (
                                    <div key={d.country} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }} onClick={() => nav("search")}>
                                        <div style={{ fontSize: 28 }}>{d.flag}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: 15 }}>{d.country} <span style={{ color: C.slateL, fontWeight: 400, fontSize: 13 }}>· {d.city}</span></div>
                                            <div style={{ fontSize: 12, color: C.slateL, marginTop: 2 }}>{d.specialties}</div>
                                        </div>
                                        <div style={{ background: "rgba(46,204,138,0.15)", color: C.green, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>Save {d.savings}</div>
                                    </div>
                                ))}
                                <Btn onClick={() => nav("search")} style={{ width: "100%", marginTop: 20, padding: 14, borderRadius: 12 }}>
                                    Browse All Hospitals
                                </Btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div style={{ padding: "100px 48px", maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ textAlign: "center", marginBottom: 64 }}>
                    <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>Everything You Need,<br /><span style={{ color: C.tealL }}>In One Platform</span></h2>
                    <p style={{ color: C.slateL, fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>From finding the right hospital to post-treatment recovery — we handle every step of your medical journey.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                    {[
                        { icon: "🔍", title: "Smart Hospital Search", desc: "Filter by specialty, country, accreditation, and price. Compare hundreds of JCI-certified hospitals.", page: "search", color: C.teal },
                        { icon: "👤", title: "Patient Portal", desc: "Track your medical journey, manage appointments, documents, and communicate with care coordinators.", page: "patient", color: C.gold },
                        { icon: "✈️", title: "Travel & Logistics", desc: "Visa assistance, flights, hotels, and airport transfers — all coordinated for you.", page: "scheduler", color: "#8B5CF6" },
                        { icon: "🛡️", title: "Insurance & Payments", desc: "Multi-currency payments, insurance claims, and treatment cost estimates.", page: "scheduler", color: "#E05252" },
                        { icon: "📋", title: "Care Coordinator", desc: "Dedicated coordinators manage your entire journey from consultation to recovery.", page: "coordinator", color: C.tealL },
                        { icon: "📊", title: "Admin Dashboard", desc: "Hospital and platform analytics, patient management, and revenue tracking.", page: "coordinator", color: C.goldL },
                    ].map(f => (
                        <div key={f.title} onClick={() => nav(f.page)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32, cursor: "pointer", transition: "all 0.25s" }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = `${f.color}44`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                            <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{f.title}</div>
                            <div style={{ color: C.slateL, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</div>
                            <div style={{ marginTop: 20, color: f.color, fontSize: 13, fontWeight: 600 }}>Explore →</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* How it works */}
            <div style={{ background: "rgba(13,155,138,0.05)", borderTop: `1px solid rgba(13,155,138,0.15)`, borderBottom: `1px solid rgba(13,155,138,0.15)`, padding: "80px 48px" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 40, fontWeight: 800, textAlign: "center", marginBottom: 60, lineHeight: 1.3 }}>Your Journey in <span style={{ color: C.tealL }}>4 Simple Steps</span></h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, position: "relative" }}>
                        <div style={{ position: "absolute", top: 40, left: "12%", right: "12%", height: 2, background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`, opacity: 0.3 }} />
                        {[
                            { n: "01", title: "Share Medical Needs", desc: "Upload records & describe your treatment requirements securely.", icon: "📤" },
                            { n: "02", title: "Get Matched", desc: "Our AI matches you with the best hospitals and doctors for your needs.", icon: "🤝" },
                            { n: "03", title: "Travel & Treat", desc: "We handle visa, flights, hotel, and coordinate with the hospital.", icon: "🛫" },
                            { n: "04", title: "Recover & Follow-up", desc: "Post-treatment monitoring and telemedicine follow-ups.", icon: "💚" },
                        ].map(s => (
                            <div key={s.n} style={{ textAlign: "center", position: "relative" }}>
                                <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}33, ${C.teal}11)`, border: `2px solid ${C.teal}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>{s.icon}</div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: 2, marginBottom: 8 }}>STEP {s.n}</div>
                                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{s.title}</div>
                                <div style={{ fontSize: 14, color: C.slateL, lineHeight: 1.6 }}>{s.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            {/* <div style={{ padding: "48px 48px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", maxWidth: 1200, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${C.teal},${C.tealL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌐</div>
                        <span style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(90deg,${C.tealL},${C.goldL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlobalCare™</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.slateL }}>© 2026 GlobalCare™ Medical Tourism Platform. All rights reserved.</div>
                </div>
            </div> */}
        </div>
    );
}
export default LandingPage;
