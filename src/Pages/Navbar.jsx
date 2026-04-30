import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, NAV_PAGES } from '../constants/data';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000, 
            height: 60, 
            background: C.white, 
            backdropFilter: "blur(20px)", 
            borderBottom: `1px solid ${C.border}`, 
            display: "flex", 
            alignItems: "center", 
            padding: "0 24px", 
            gap: 12,
            boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.1)" : "none",
            transition: "box-shadow 0.3s ease"
        }}>
            <div onClick={() => nav("/")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginRight: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg,${C.teal},${C.tealL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌐</div>
                <span style={{ fontSize: 18, fontWeight: 800, background: `linear-gradient(90deg,${C.tealL},${C.goldL})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlobalCare™</span>
            </div>
            <div style={{ display: "flex", gap: 4, flex: 1 }}>
                {NAV_PAGES.map(p => (
                    <div
                        key={p.key}
                        style={{ position: "relative" }}
                        onMouseEnter={() => p.key === "scheduler"}
                    // onMouseLeave={() => setHoveredNav(null)}
                    >
                        <button onClick={() => {
                            nav(p.key);
                        }} style={{ background: "transparent", color: C.slateL, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500, border: "none", whiteSpace: "nowrap" }}>{p.icon} {p.label}</button>
                    </div>
                ))}
                <button 
                    onClick={() => window.open("https://adminglobalcare.vercel.app/", "_blank")}
                    style={{ 
                        background: `linear-gradient(135deg,${C.teal},${C.tealL})`, 
                        color: "#fff", 
                        padding: "6px 16px", 
                        borderRadius: 8, 
                        cursor: "pointer", 
                        fontSize: 13, 
                        fontWeight: 600, 
                        border: "none", 
                        whiteSpace: "nowrap",
                        marginLeft: "auto"
                    }}
                >
                    🔐 Login
                </button>
            </div>
        </nav>
    );
}
export default Navbar;
