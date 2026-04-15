import React from 'react';
import { C } from '../constants/data';

const Btn = ({ children, onClick, variant = "primary", style = {}, disabled, small }) => (
    <button onClick={onClick} disabled={disabled} style={{
        padding: small ? "7px 16px" : "10px 22px", borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 700, fontSize: small ? 12 : 13, border: "none", transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
        ...(variant === "primary" ? { background: `linear-gradient(135deg,${C.teal},${C.tealL})`, color: C.white } : {}),
        ...(variant === "ghost" ? { background: "rgba(255,255,255,0.05)", color: C.slateL, border: `1px solid ${C.border}` } : {}),
        ...(variant === "gold" ? { background: `linear-gradient(135deg,${C.gold},${C.goldL})`, color: "#1a1000" } : {}),
        ...(variant === "danger" ? { background: "rgba(224,82,82,0.15)", color: C.red, border: `1px solid ${C.red}44` } : {}),
        ...style
    }}>{children}</button>
);

export default Btn;
