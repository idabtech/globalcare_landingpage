import React, { useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { C } from '../constants/data';
import Btn from '../ui/Btn';
import { useNavigate } from 'react-router-dom';
import { hospitalService } from '../service/hospital.service';

/* ─── Design tokens ──────────────────────────────────────────── */
const T = {
    navy: '#FFFFFF',
    navyMid: '#F8F9FA',
    card: 'rgba(0,0,0,0.03)',
    border: 'rgba(0,0,0,0.08)',
    teal: '#0BB5A0',
    tealL: '#14D4BC',
    tealXL: '#5EEADA',
    gold: '#D4A843',
    goldL: '#F0C96B',
    slate: '#2C3E50',
    slateL: '#5A6C7D',
    green: '#2ECC8A',
    white: '#000000',
    offWhite: '#F4F6FA',
};

/* ─── Utility: animate counter ───────────────────────────────── */
function useCounter(target, active, duration = 1400) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = null;
        const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(ease * target));
            if (p < 1) requestAnimationFrame(step);
        };
        const raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [active, target, duration]);
    return val;
}

/* ─── Pill tag ───────────────────────────────────────────────── */
const Pill = ({ children, color = T.tealL }) => (
    <span style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        background: color + '1A',
        color,
        border: `1px solid ${color}33`,
    }}>{children}</span>
);

/* ─── Horizontal divider rule ────────────────────────────────── */
const Rule = ({ style }) => (
    <div style={{
        width: '100%', height: 1,
        background: `linear-gradient(90deg, transparent, ${T.teal}33, transparent)`,
        ...style
    }} />
);

/* ─── Animated number stat ───────────────────────────────────── */
const StatNum = ({ value, suffix = '', label, desc, color = T.tealL, active }) => {
    const num = useCounter(value, active);
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 900, color, letterSpacing: -2, lineHeight: 1, marginBottom: 6 }}>
                {num}{suffix}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.white, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 12, color: T.slateL }}>{desc}</div>
        </div>
    );
};

/* ─── Main component ─────────────────────────────────────────── */
const LandingPage = () => {
    const { setSelectedSpecialty, selectedSpecialty } = React.useContext(AppContext);
    const nav = useNavigate();
    const [statsVisible, setStatsVisible] = useState(false);
    const [heroIn, setHeroIn] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [hospitalData, setHospitalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const statsRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => setHeroIn(true), 100);
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll);
        return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); };
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setStatsVisible(true);
        }, { threshold: 0.3 });
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    const getHospitalData = async () => {
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
            const specArray = Array.isArray(specialties) ? specialties : [specialties];
            return {
                ...h,
                specialties: [...new Set(specArray.filter(Boolean))]
            };
        });
        setHospitalData(normalized);
        setLoading(false);
    };

    useEffect(() => {
        getHospitalData();
    }, []);

    /* ── shared reveal style ── */
    const reveal = (delay = 0) => ({
        opacity: heroIn ? 1 : 0,
        transform: heroIn ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    });

    /* ── card hover helpers ── */
    const onHover = (e, on) => {
        e.currentTarget.style.transform = on ? 'translateY(-6px)' : 'translateY(0)';
        e.currentTarget.style.borderColor = on ? `${T.teal}55` : T.border;
        e.currentTarget.style.background = on ? 'rgba(0,0,0,0.065)' : T.card;
        e.currentTarget.style.boxShadow = on ? `0 24px 48px rgba(11,181,160,0.12)` : 'none';
    };

    return (
        <div style={{ background: T.navy, color: T.white, fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap');
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
                @keyframes shimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                @keyframes orbit { from { transform: rotate(0deg) translateX(220px) rotate(0deg); } to { transform: rotate(360deg) translateX(220px) rotate(-360deg); } }
                @keyframes pulseRing { 0% { transform: scale(0.9); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
                ::selection { background: ${T.teal}44; }
                * { box-sizing: border-box; }
            `}</style>

            {/* ── HERO ── */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                padding: '80px 56px',
                background: `radial-gradient(ellipse 80% 60% at 70% 50%, ${T.teal}14 0%, transparent 60%), radial-gradient(ellipse 50% 80% at 10% 30%, ${T.gold}0A 0%, transparent 50%), ${T.navy}`,
            }}>
                {/* grid texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `linear-gradient(${T.teal}08 1px, transparent 1px), linear-gradient(90deg, ${T.teal}08 1px, transparent 1px)`,
                    backgroundSize: '64px 64px',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 70% 50%, black 30%, transparent 80%)',
                }} />

                {/* decorative orb */}
                <div style={{
                    position: 'absolute', right: '6%', top: '50%',
                    transform: 'translateY(-50%)',
                    width: 520, height: 520,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 40% 40%, ${T.teal}22, transparent 65%)`,
                    border: `1px solid ${T.teal}18`,
                    pointerEvents: 'none',
                    animation: 'float 8s ease-in-out infinite',
                }}>
                    {/* inner ring */}
                    <div style={{
                        position: 'absolute', inset: 48,
                        borderRadius: '50%',
                        border: `1px solid ${T.teal}20`,
                    }} />
                    <div style={{
                        position: 'absolute', inset: 100,
                        borderRadius: '50%',
                        border: `1px dashed ${T.teal}15`,
                    }} />
                    {/* orbiting dot */}
                    {[0, 120, 240].map((deg, i) => (
                        <div key={i} style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: 8, height: 8, borderRadius: '50%',
                            background: i === 0 ? T.tealL : i === 1 ? T.goldL : T.green,
                            marginLeft: -4, marginTop: -4,
                            animation: `orbit ${6 + i * 2}s linear infinite`,
                            animationDelay: `${i * -2}s`,
                            transformOrigin: '0 0',
                        }} />
                    ))}
                </div>

                <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
                    <div style={{ maxWidth: 640 }}>
                        {/* eyebrow */}
                        <div style={{ ...reveal(0), display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: T.green,
                                boxShadow: `0 0 0 4px ${T.green}22`,
                                animation: 'pulseRing 2s ease-out infinite',
                                flexShrink: 0,
                            }} />
                            <span style={{ fontSize: 13, color: T.slateL, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                                340+ Accredited Hospitals · 68 Countries
                            </span>
                        </div>

                        {/* headline */}
                        <h1 style={{
                            ...reveal(0.1),
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 72, fontWeight: 900, lineHeight: 1.08,
                            letterSpacing: -2, marginBottom: 28,
                        }}>
                            World-Class Care,<br />
                            <span style={{
                                background: `linear-gradient(100deg, ${T.tealL}, ${T.goldL})`,
                                backgroundSize: '200% 200%',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'shimmer 5s ease-in-out infinite',
                            }}>
                                Global Access
                            </span>
                        </h1>

                        <p style={{ ...reveal(0.2), fontSize: 18, color: T.slateL, lineHeight: 1.75, marginBottom: 40, maxWidth: 500 }}>
                            Connect with JCI‑accredited hospitals in 68 countries. Save up to 80% on medical procedures without compromising quality.
                        </p>

                        <div style={{ ...reveal(0.3), display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                            <button onClick={() => nav('search')} style={{
                                padding: '14px 30px',
                                borderRadius: 12,
                                border: 'none',
                                background: `linear-gradient(135deg, ${T.teal}, ${T.tealL})`,
                                color: T.navy,
                                fontWeight: 700,
                                fontSize: 15,
                                cursor: 'pointer',
                                letterSpacing: '0.02em',
                                boxShadow: `0 8px 32px ${T.teal}44`,
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${T.teal}55`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 32px ${T.teal}44`; }}
                            >Find a Hospital →</button>
                            <button onClick={() => window.open(import.meta.env.VITE_ADMIN_URL, "_blank")} style={{
                                padding: '14px 30px',
                                borderRadius: 12,
                                border: `1px solid ${T.border}`,
                                background: T.card,
                                color: T.white,
                                fontWeight: 600,
                                fontSize: 15,
                                cursor: 'pointer',
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.teal}55`; e.currentTarget.style.background = 'rgba(0,0,0,0.07)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}
                            >Patient Portal</button>
                        </div>

                        {/* quick stats row */}
                        <div style={{ ...reveal(0.45), display: 'flex', gap: 40, marginTop: 56, paddingTop: 40, borderTop: `1px solid ${T.border}` }}>
                            {[
                                { n: '1M+', l: 'Patients Served' },
                                { n: '68', l: 'Countries' },
                                { n: '80%', l: 'Avg. Savings' },
                            ].map(({ n, l }) => (
                                <div key={l}>
                                    <div style={{ fontSize: 30, fontWeight: 900, color: T.tealL, letterSpacing: -1 }}>{n}</div>
                                    <div style={{ fontSize: 12, color: T.slateL, letterSpacing: '0.04em', marginTop: 2 }}>{l}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* floating destination card (right side) */}
                <div style={{
                    ...reveal(0.5),
                    position: 'absolute', right: 56, top: '50%',
                    transform: heroIn ? 'translateY(-50%)' : 'translateY(-30%)',
                    transition: 'opacity 0.9s ease 0.5s, transform 0.9s ease 0.5s',
                    width: 320,
                    // background: 'rgba(10,24,40,0.85)',
                    // backdropFilter: 'blur(24px)',
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    padding: '24px 24px 20px',
                    zIndex: 2,
                }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.slateL, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Popular Destinations</div>
                    {[
                        { flag: '🇹🇭', country: 'Thailand', city: 'Bangkok', save: '70%', spec: 'Cardiology, Dental' },
                        { flag: '🇮🇳', country: 'India', city: 'Chennai', save: '80%', spec: 'Oncology, Neurology' },
                        { flag: '🇹🇷', country: 'Turkey', city: 'Istanbul', save: '75%', spec: 'Cosmetic, Dental' },
                        { flag: '🇸🇬', country: 'Singapore', city: 'Singapore', save: '45%', spec: 'Cardiology, Cancer' },
                    ].map(d => (
                        <div key={d.country} onClick={() => nav('search')}
                            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: `1px solid ${T.border}`, cursor: 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                        >
                            <span style={{ fontSize: 24 }}>{d.flag}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.country} <span style={{ color: T.slateL, fontWeight: 400 }}>· {d.city}</span></div>
                                <div style={{ fontSize: 11, color: T.slateL, marginTop: 1 }}>{d.spec}</div>
                            </div>
                            <div style={{ background: `${T.green}1A`, color: T.green, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 20, border: `1px solid ${T.green}33` }}>-{d.save}</div>
                        </div>
                    ))}
                    <button onClick={() => nav('search')} style={{
                        width: '100%', marginTop: 16, padding: '11px',
                        background: `linear-gradient(135deg, ${T.teal}, ${T.tealL})`,
                        border: 'none', borderRadius: 10,
                        color: T.navy, fontWeight: 700, fontSize: 14,
                        cursor: 'pointer', transition: 'opacity 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                    >Browse All Hospitals</button>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{ padding: '100px 56px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 72 }}>
                    <Pill>Platform</Pill>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, lineHeight: 1.15, marginTop: 16, marginBottom: 16 }}>
                        Everything You Need,<br /><span style={{ color: T.tealL }}>In One Platform</span>
                    </h2>
                    <p style={{ color: T.slateL, fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                        From finding the right hospital to post-treatment recovery — we coordinate every step.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    {[
                        { icon: '🔍', title: 'Smart Hospital Search', desc: 'Filter by specialty, country, accreditation, and price. Compare JCI-certified hospitals side-by-side.', page: 'search', accent: T.tealL },
                        { icon: '👤', title: 'Patient Portal', desc: 'Track appointments, manage documents, and communicate with care coordinators in real time.', page: 'patient', accent: T.goldL },
                        { icon: '✈️', title: 'Travel & Logistics', desc: 'Visa assistance, flights, hotels, and airport transfers — all seamlessly coordinated.', page: 'scheduler', accent: '#A78BFA' },
                        { icon: '🛡️', title: 'Insurance & Payments', desc: 'Multi-currency payments, insurance claims processing, and procedure cost estimates.', page: 'scheduler', accent: '#F87171' },
                        { icon: '📋', title: 'Care Coordinator', desc: 'Dedicated human coordinators manage your entire journey from first consultation to full recovery.', page: 'coordinator', accent: T.tealL },
                        { icon: '📊', title: 'Admin Dashboard', desc: 'Hospital analytics, patient management, and revenue tracking for platform operators.', page: 'coordinator', accent: T.goldL },
                    ].map(f => (
                        <div key={f.title} onClick={() => nav(f.page)}
                            style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: '28px 28px 24px', cursor: 'pointer', transition: 'all 0.25s ease' }}
                            onMouseEnter={e => onHover(e, true)}
                            onMouseLeave={e => onHover(e, false)}
                        >
                            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.accent}18`, border: `1px solid ${f.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 18 }}>{f.icon}</div>
                            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{f.title}</div>
                            <div style={{ color: T.slateL, fontSize: 13, lineHeight: 1.65 }}>{f.desc}</div>
                            <div style={{ marginTop: 18, color: f.accent, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>EXPLORE →</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── STATS ── */}
            <section ref={statsRef} style={{
                margin: '0 56px',
                borderRadius: 24,
                background: `linear-gradient(135deg, ${T.teal}22 0%, ${T.navyMid} 40%, ${T.gold}0F 100%)`,
                border: `1px solid ${T.teal}25`,
                padding: '72px 80px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${T.teal}15, transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, position: 'relative', zIndex: 1 }}>
                    <StatNum value={340} suffix='+' label='Accredited Hospitals' desc='JCI-certified worldwide' color={T.tealL} active={statsVisible} />
                    <StatNum value={68} label='Countries' desc='Global healthcare network' color={T.goldL} active={statsVisible} />
                    <StatNum value={80} suffix='%' label='Average Savings' desc='Compared to US prices' color='#A78BFA' active={statsVisible} />
                    <StatNum value={49} suffix='/5' label='Patient Rating' desc='Based on 10,000+ reviews' color={T.green} active={statsVisible} />
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ padding: '100px 56px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 72 }}>
                    <Pill color={T.goldL}>Process</Pill>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, lineHeight: 1.15, marginTop: 16 }}>
                        Your Journey in <span style={{ color: T.tealL }}>4 Simple Steps</span>
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
                    {/* connector line */}
                    <div style={{ position: 'absolute', top: 40, left: '12%', right: '12%', height: 1, background: `linear-gradient(90deg, ${T.teal}55, ${T.gold}55)`, zIndex: 0 }} />
                    {[
                        { n: '01', title: 'Share Medical Needs', desc: 'Upload records and describe your treatment requirements securely.', icon: '📤' },
                        { n: '02', title: 'Get Matched', desc: 'Our AI matches you with the best hospitals and doctors for your case.', icon: '🤝' },
                        { n: '03', title: 'Travel & Treat', desc: 'We handle visa, flights, hotel, and coordinate with the hospital.', icon: '🛫' },
                        { n: '04', title: 'Recover & Follow-up', desc: 'Post-treatment monitoring and telemedicine follow-ups included.', icon: '💚' },
                    ].map((s, i) => (
                        <div key={s.n} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: '50%',
                                background: `linear-gradient(135deg, ${T.teal}2A, ${T.navyMid})`,
                                border: `1.5px solid ${T.teal}44`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 30, margin: '0 auto 24px',
                                boxShadow: `0 0 0 8px ${T.navy}`,
                                transition: 'all 0.3s ease',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.borderColor = T.tealL; e.currentTarget.style.boxShadow = `0 0 0 8px ${T.navy}, 0 0 32px ${T.teal}33`; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `${T.teal}44`; e.currentTarget.style.boxShadow = `0 0 0 8px ${T.navy}`; }}
                            >{s.icon}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: T.teal, letterSpacing: '0.1em', marginBottom: 8 }}>STEP {s.n}</div>
                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{s.title}</div>
                            <div style={{ fontSize: 13, color: T.slateL, lineHeight: 1.65 }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── HOSPITALS ── */}
            <section style={{ padding: '0 56px 100px', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <Pill>Featured</Pill>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, lineHeight: 1.15, marginTop: 16, marginBottom: 16 }}>
                        Featured <span style={{ color: T.tealL }}>Hospitals</span>
                    </h2>
                    <p style={{ color: T.slateL, fontSize: 16, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
                        Handpicked world-class facilities with proven track records.
                    </p>
                </div>

                {/* filter tabs */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 48, flexWrap: 'wrap' }}>
                    {['All', 'Cardiology', 'Orthopedics', 'Cancer', 'Dental'].map(sp => {
                        const active = (selectedSpecialty || 'All') === sp;
                        return (
                            <button key={sp} onClick={() => setSelectedSpecialty(sp)} style={{
                                padding: '7px 20px', borderRadius: 20,
                                border: `1px solid ${active ? T.teal : T.border}`,
                                background: active ? `${T.teal}20` : 'transparent',
                                color: active ? T.tealL : T.slateL,
                                fontSize: 13, fontWeight: active ? 700 : 500,
                                cursor: 'pointer', transition: 'all 0.2s ease',
                            }}
                                onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = `${T.teal}44`; e.currentTarget.style.color = T.white; } }}
                                onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.slateL; } }}
                            >{sp}</button>
                        );
                    })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24 }}>
                                <div style={{
                                    height: 120, borderRadius: 12, marginBottom: 20,
                                    background: `linear-gradient(135deg, ${T.teal}18, ${T.gold}0F)`,
                                    border: `1px solid ${T.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 40,
                                }}>?</div>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Loading...</div>
                            </div>
                        ))
                    ) : hospitalData.slice(0, 3).filter(h => !selectedSpecialty || selectedSpecialty === 'All' || h.specialties?.includes(selectedSpecialty))
                        .map((h, i) => (
                            <div key={i} onClick={() => nav('search')}
                                style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 24, cursor: 'pointer', transition: 'all 0.3s ease' }}
                                onMouseEnter={e => onHover(e, true)}
                                onMouseLeave={e => onHover(e, false)}
                            >
                                {/* hospital image placeholder */}
                                <div style={{
                                    height: 120, borderRadius: 12, marginBottom: 20,
                                    background: `linear-gradient(135deg, ${T.teal}18, ${T.gold}0F)`,
                                    border: `1px solid ${T.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 40, position: 'relative', overflow: 'hidden',
                                }}>
                                    🏥
                                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                                        <Pill color={T.green}>JCI</Pill>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4, lineHeight: 1.3 }}>{h.name}</div>
                                <div style={{ fontSize: 13, color: T.slateL, marginBottom: 10 }}>{h.city}, {h.country}</div>
                                <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                                    {[...Array(5)].map((_, j) => (
                                        <span key={j} style={{ color: j < Math.floor(h.rating || 4) ? T.goldL : T.slate, fontSize: 12 }}>&#9733;</span>
                                    ))}
                                    <span style={{ fontSize: 12, color: T.slateL, marginLeft: 4 }}>{h.rating || '4.5'}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                                    {h.specialties?.slice(0, 3).map(s => <Pill key={s} color={T.slateL}>{s}</Pill>)}
                                </div>
                                <Rule style={{ marginBottom: 16 }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: T.tealL, letterSpacing: -0.5 }}>{h.average_price || '$5,000'}</div>
                                        <div style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>Save {h.savings || '60%'}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: 11, color: T.slateL, lineHeight: 1.6 }}>
                                        <div>{h.reviews || '1000'} reviews</div>
                                        <div>{h.accreditation || 'JCI'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 48 }}>
                    <button onClick={() => nav('search')} style={{
                        padding: '14px 36px', borderRadius: 12,
                        border: `1px solid ${T.teal}44`,
                        background: `${T.teal}12`,
                        color: T.tealL, fontWeight: 700, fontSize: 15,
                        cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${T.teal}22`; e.currentTarget.style.borderColor = T.teal; }}
                        onMouseLeave={e => { e.currentTarget.style.background = `${T.teal}12`; e.currentTarget.style.borderColor = `${T.teal}44`; }}
                    >View All Hospitals →</button>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{
                background: `linear-gradient(180deg, ${T.navy} 0%, ${T.navyMid} 100%)`,
                borderTop: `1px solid ${T.border}`,
                borderBottom: `1px solid ${T.border}`,
                padding: '100px 56px',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <Pill color={T.goldL}>Testimonials</Pill>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 900, lineHeight: 1.15, marginTop: 16, marginBottom: 14 }}>
                            What Our <span style={{ color: T.tealL }}>Patients Say</span>
                        </h2>
                        <p style={{ color: T.slateL, fontSize: 16, maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
                            Real stories from people who found world-class healthcare through GlobalCare™
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {[
                            { name: 'Sarah Johnson', loc: '🇺🇸 United States', proc: 'Hip Replacement', hosp: 'Bumrungrad Hospital, Thailand', text: 'The care I received was exceptional. My coordinator handled everything from flights to follow-up appointments. I saved over $40,000 compared to US prices!', avatar: 'SJ' },
                            { name: 'Michael Chen', loc: '🇨🇦 Canada', proc: 'Cardiac Bypass', hosp: 'Apollo Hospitals, India', text: 'From initial consultation to recovery, every step was seamless. The doctors were world-class, and the savings were incredible.', avatar: 'MC' },
                            { name: 'Emma Rodriguez', loc: '🇦🇺 Australia', proc: 'IVF Treatment', hosp: 'Prince Court, Malaysia', text: 'After years trying, we finally found success. The clinic was amazing, and GlobalCare made the entire process stress-free.', avatar: 'ER' },
                        ].map((t, i) => (
                            <div key={i}
                                style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 28, cursor: 'default', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.teal}33`; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                {/* quote mark */}
                                <div style={{ position: 'absolute', top: 16, right: 24, fontSize: 64, lineHeight: 1, color: `${T.teal}18`, fontFamily: 'serif', pointerEvents: 'none', userSelect: 'none' }}>"</div>
                                {/* stars */}
                                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                                    {[...Array(5)].map((_, j) => <span key={j} style={{ color: T.goldL, fontSize: 13 }}>★</span>)}
                                </div>
                                <p style={{ color: T.slateL, fontSize: 14, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                                <Rule style={{ marginBottom: 16 }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${T.teal}22`, border: `1px solid ${T.teal}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: T.tealL, flexShrink: 0 }}>{t.avatar}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                                        <div style={{ fontSize: 11, color: T.slateL }}>{t.loc} · {t.proc}</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 10, fontSize: 11, color: T.teal }}>{t.hosp}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ── */}
            <section style={{ padding: '80px 56px' }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    background: `linear-gradient(135deg, ${T.teal}22 0%, ${T.navyMid} 50%, ${T.gold}10 100%)`,
                    border: `1px solid ${T.teal}2A`,
                    borderRadius: 28,
                    padding: '64px 72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 48,
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', right: -80, top: -80, width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${T.teal}12, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, fontWeight: 900, lineHeight: 1.15, marginBottom: 14 }}>
                            Ready to Start Your<br /><span style={{ color: T.tealL }}>Medical Journey?</span>
                        </h2>
                        <p style={{ color: T.slateL, fontSize: 16, lineHeight: 1.7, maxWidth: 440 }}>
                            Join over 1 million patients who've discovered affordable, world-class healthcare around the globe.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, position: 'relative', zIndex: 1 }}>
                        <button onClick={() => nav('search')} style={{
                            padding: '14px 36px', borderRadius: 12, border: 'none',
                            background: `linear-gradient(135deg, ${T.teal}, ${T.tealL})`,
                            color: T.navy, fontWeight: 700, fontSize: 15,
                            cursor: 'pointer', boxShadow: `0 8px 32px ${T.teal}44`,
                            transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 16px 40px ${T.teal}55`; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 8px 32px ${T.teal}44`; }}
                        >Find a Hospital →</button>
                        {/* <button onClick={() => nav('coordinator')} style={{
                            padding: '12px 36px', borderRadius: 12,
                            border: `1px solid ${T.border}`,
                            background: T.card,
                            color: T.slateL, fontWeight: 600, fontSize: 14,
                            cursor: 'pointer', transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = `${T.teal}44`; e.currentTarget.style.color = T.white; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.slateL; }}
                        >Talk to a Coordinator</button> */}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: `1px solid ${T.border}`, padding: '32px 56px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.teal}, ${T.tealL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌐</div>
                        <span style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(90deg, ${T.tealL}, ${T.goldL})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>GlobalCare™</span>
                    </div>
                    <div style={{ fontSize: 12, color: T.slateL }}>© 2026 GlobalCare™ Medical Tourism Platform. All rights reserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;